package wsms.agent.network;

import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

public class IPUtils {
    public static List<String> getLocalIPs() throws Exception {
        List<String> ips = new ArrayList<>();
        Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces();
        if (interfaces == null) {
            return ips;
        }

        while (interfaces.hasMoreElements()) {
            NetworkInterface iface = interfaces.nextElement();
            if (!iface.isUp() || iface.isLoopback()) {
                continue;
            }

            Enumeration<InetAddress> addresses = iface.getInetAddresses();
            while (addresses.hasMoreElements()) {
                InetAddress address = addresses.nextElement();
                if (address.isLoopbackAddress() || !(address instanceof Inet4Address)) {
                    continue;
                }
                ips.add(address.getHostAddress());
            }
        }
        return ips;
    }

    public static String getPrimaryIP() throws Exception {
        List<String> ips = getLocalIPs();
        if (ips.isEmpty()) {
            return "";
        }
        return ips.get(0);
    }

    public static List<String> getAllPrimaryIPs() throws Exception {
        return getLocalIPs();
    }
}
