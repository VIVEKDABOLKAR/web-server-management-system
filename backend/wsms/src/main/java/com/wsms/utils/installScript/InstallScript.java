package com.wsms.utils.installScript;

import com.wsms.config.AwsConfig;
import com.wsms.entity.Server;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

import com.wsms.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.s3.S3Client;

@Component
@RequiredArgsConstructor
public class InstallScript {

    private static final String TEMPLATE_PATH = "classpath:install-script/install-agent.sh.template";
    private static final String DEFAULT_COLLECTION_INTERVAL = "5";

    @Value(TEMPLATE_PATH)
    private Resource templateResource;

    @Value("${app.agent.jar-url}")
    private String jarUrl;

    @Value("${app.agent.jar-name}")
    private String jarName;

    private final S3Service s3Service;

    public String generatePublicTemplate() {
        return renderTemplate("", "", "", "", DEFAULT_COLLECTION_INTERVAL, 7088, 4017, true);
    }

    public String generateScript(Server server, String backendUrl) {
        return renderTemplate(
                String.valueOf(server.getId()),
                server.getAgentToken(),
                server.getServerName(),
                backendUrl,
                DEFAULT_COLLECTION_INTERVAL,
                7088,
                4017,
                true
        );
    }

    public String generateScriptAndUpload(Server server, String backendUrl, int webServerPort, int publishPort, boolean webApplicationMonitor) {
         String renderedTemplate = renderTemplate(
                String.valueOf(server.getId()),
                server.getAgentToken(),
                server.getServerName(),
                backendUrl,
                DEFAULT_COLLECTION_INTERVAL,
                webServerPort,
                publishPort,
                webApplicationMonitor
        );

         //save renderTemplate as install-script-{server.id}.sh
        try {
            String fileName = "install-script-" + server.getId() + ".sh";

            return  s3Service.uploadFile(fileName, renderedTemplate.getBytes(StandardCharsets.UTF_8));



        } catch (Exception e) {
            throw new RuntimeException("Failed to save install script", e);
        }
    }

    private String renderTemplate(
            String serverId,
            String agentToken,
            String serverName,
            String backendUrl,
            String collectionInterval,
            int webServerPort,
            int publishPort,
            boolean webApplicationMonitor
    ) {
        String template = readTemplate();

        return template
                .replace("__JAR_URL__", escapeForDoubleQuotes(jarUrl))
                .replace("__JAR_NAME__", escapeForDoubleQuotes(jarName))
                .replace("__SERVER_ID__", escapeForDoubleQuotes(serverId))
                .replace("__AGENT_TOKEN__", escapeForDoubleQuotes(agentToken))
                .replace("__SERVER_NAME__", escapeForDoubleQuotes(serverName))
                .replace("__BACKEND_URL__", escapeForDoubleQuotes(backendUrl))
                .replace("__COLLECTION_INTERVAL__", escapeForDoubleQuotes(collectionInterval))
                .replace("__WEB_SERVER_HOST__", escapeForDoubleQuotes("::1"))
                .replace("__WEB_SERVER_PORT__", escapeForDoubleQuotes(String.valueOf(webServerPort)))
                .replace("__PUBLISH_PORT__", escapeForDoubleQuotes(String.valueOf(publishPort)))
                .replace("__WEB_APPLICATION_MONITOR__", escapeForDoubleQuotes(String.valueOf(webApplicationMonitor)));
    }

    private String readTemplate() {
        try (InputStream inputStream = templateResource.getInputStream()) {
            return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to load install script template", ex);
        }
    }

    private String escapeForDoubleQuotes(String value) {
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("$", "\\$")
                .replace("`", "\\`");
    }
}
