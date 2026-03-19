package wsms.agent;

import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

import wsms.agent.config.Config;
import wsms.agent.config.ConfigUtils;
import wsms.agent.core.Agent;

public class Main {
    public static void main(String[] args) {

        //parse args :- --configPath= --serverId= --agentToken= --serverName --backendUrl --collectionInterval
        //                  --webServerHost= --webServerPort= --publishPort=
        Map<String, String> configArgs = parseArgs(args);

        //get config file
        String configPath = configArgs.getOrDefault("configPath", "config.json");

        // Load config
        Config config = ConfigUtils.saveConfigArgs(configArgs , configPath);

        //init agent
        Agent agent;
        try {
            agent = Agent.newAgent(configPath);
        } catch (Exception ex) {
            System.out.printf("Failed to create agent: %s%n", ex.getMessage());
            System.exit(1);
            return;
        }

        //during runtime shutdoen ctrl + c
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("\nReceived shutdown signal...");
            agent.stop();
        }));

        agent.start();
    }

    //parse cmd args
    private static Map<String, String> parseArgs(String[] args) {
        Map<String, String> map = new HashMap<>();

        //convert strings args into key-value map
        for (String arg : args) {
            if (arg.startsWith("--")) {
                String[] parts = arg.substring(2).split("=", 2);
                if (parts.length == 2) {
                    map.put(parts[0], parts[1]);
                }
            }
        }

        return map;
    }
}
