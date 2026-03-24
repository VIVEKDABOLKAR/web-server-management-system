package wsms.agent.monitor.netty;

import io.netty.bootstrap.Bootstrap;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import wsms.agent.utils.Logger;

import java.util.concurrent.atomic.AtomicInteger;

public class NettyConnectionMonitor {

    private final int publishPort;
    private final String targetHost;
    private final int targetPort;
    private final Logger logger;

    private final AtomicInteger reqCount = new AtomicInteger(0);

    private EventLoopGroup bossGroup;
    private EventLoopGroup workerGroup;

    public NettyConnectionMonitor(int publishPort, String targetHost, int targetPort, Logger logger) {
        this.publishPort = publishPort;
        this.targetHost = targetHost;
        this.targetPort = targetPort;
        this.logger = logger;
        logger.infof("[INIT] NettyConnectionMonitor created: port=%d, forward to %s:%d", 
                     publishPort, targetHost, targetPort);
    }

    public void start() throws InterruptedException {
        logger.info("[START] Starting NettyConnectionMonitor...");
        bossGroup = new NioEventLoopGroup(1);
        logger.info("[START] Boss event loop created (1 thread for accepts)");
        workerGroup = new NioEventLoopGroup();
        logger.info("[START] Worker event loop created (CPU*2 threads for I/O)");

        ServerBootstrap b = new ServerBootstrap();
        logger.info("[START] ServerBootstrap created");

        b.group(bossGroup, workerGroup)
                .channel(NioServerSocketChannel.class)
                .childHandler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) {
                        logger.infof("[CHANNEL] New connection initialized from %s", ch.remoteAddress());
                        ch.pipeline().addLast(new ProxyFrontendHandler(targetHost, targetPort, logger, reqCount));
                    }
                });

        logger.infof("[START] Binding to port %d...", publishPort);
        b.bind(publishPort).sync();
        logger.infof("[START] SUCCESS - Proxy listening on port %d", publishPort);
        logger.infof("[START] Forwarding to backend: %s:%d", targetHost, targetPort);
    }

    public void stop() {
        logger.info("[STOP] Stopping NettyConnectionMonitor...");
        if (bossGroup != null) {
            logger.info("[STOP] Boss group shutting down");
            bossGroup.shutdownGracefully();
        }
        if (workerGroup != null) {
            logger.info("[STOP] Worker group shutting down");
            workerGroup.shutdownGracefully();
        }
        logger.info("[STOP] Proxy stopped");
    }
}

class ProxyFrontendHandler extends ChannelInboundHandlerAdapter {

    private final String host;
    private final int port;
    private final Logger logger;
    private final AtomicInteger counter;

    private Channel outboundChannel;

    public ProxyFrontendHandler(String host, int port, Logger logger, AtomicInteger counter) {
        this.host = host;
        this.port = port;
        this.logger = logger;
        this.counter = counter;
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        final Channel inboundChannel = ctx.channel();
        long connNum = counter.incrementAndGet();
        logger.infof("[CONN] New connection #%d from %s", connNum, inboundChannel.remoteAddress());

        logger.info("========================================");
        logger.info("Connection received from " + inboundChannel.remoteAddress());

        Bootstrap b = new Bootstrap();
        b.group(inboundChannel.eventLoop())
                .channel(NioSocketChannel.class)
                .handler(new ProxyBackendHandler(inboundChannel));

        logger.infof("[CONN] Connecting to backend %s:%d", host, port);
        b.connect(host, port).addListener((ChannelFutureListener) future -> {
            if (future.isSuccess()) {
                outboundChannel = future.channel();
                logger.infof("[CONN] Backend connected: %s", outboundChannel.remoteAddress());
                logger.infof("[CONN] Tunnel ready: %s <-> %s", inboundChannel.remoteAddress(), outboundChannel.remoteAddress());
            } else {
                logger.errorf("[CONN] Backend connection failed: %s", future.cause().getMessage());
                inboundChannel.close();
                logger.infof("[CONN] Closed client due to backend failure");
            }
        });
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        if (msg instanceof io.netty.buffer.ByteBuf) {
            int size = ((io.netty.buffer.ByteBuf) msg).readableBytes();
            logger.infof("[READ] Data from client %s (size=%d bytes), forwarding to backend",
                         ctx.channel().remoteAddress(), size);
        }
        if (outboundChannel != null && outboundChannel.isActive()) {
            outboundChannel.writeAndFlush(msg);
        } else {
            logger.errorf("[READ] Backend unavailable, dropping data from %s", ctx.channel().remoteAddress());
        }
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) {
        logger.infof("[CLOSE] Client disconnected: %s", ctx.channel().remoteAddress());
        if (outboundChannel != null) {
            logger.infof("[CLOSE] Closing backend: %s", outboundChannel.remoteAddress());
            outboundChannel.close();
        }
        logger.info("Connection closed: " + ctx.channel().remoteAddress());
        logger.info("========================================");
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        logger.errorf("[ERROR] Exception from %s: %s", ctx.channel().remoteAddress(), cause.getMessage());
        cause.printStackTrace();
        if (outboundChannel != null && outboundChannel.isActive()) {
            outboundChannel.close();
        }
        ctx.close();
        logger.infof("[ERROR] Closed both sides due to exception");
    }
}

class ProxyBackendHandler extends ChannelInboundHandlerAdapter {

    private final Channel inboundChannel;

    public ProxyBackendHandler(Channel inboundChannel) {
        this.inboundChannel = inboundChannel;
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        if (msg instanceof io.netty.buffer.ByteBuf) {
            int size = ((io.netty.buffer.ByteBuf) msg).readableBytes();
            // Don't log here excessively (can be high traffic), but can enable for debugging
            // logger.debugf("[BACKEND] Response from %s (size=%d), forwarding to client", 
            //              ctx.channel().remoteAddress(), size);
        }
        if (inboundChannel.isActive()) {
            inboundChannel.writeAndFlush(msg);
        }
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) {
        if (inboundChannel != null) {
            inboundChannel.close();
        }
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        ctx.close();
    }
}
