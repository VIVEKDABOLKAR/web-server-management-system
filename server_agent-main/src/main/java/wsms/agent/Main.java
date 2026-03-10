package wsms.agent;

import java.util.Scanner;

import wsms.agent.config.Config;
import wsms.agent.core.Agent;

public class Main {
    public static void main(String[] args) {
        String configPath = "config.json";
        if (args.length > 0) {
            configPath = args[0];
        }

        // Load config
        Config config = Config.load(configPath);
        
        // Check if server ID and token are configured
        if (config.getServerIdLong() == null || config.getServerIdLong() == 1L || 
            config.getAuthToken() == null || config.getAuthToken().isEmpty() || 
            config.getAuthToken().equals("your-agent-token-here")) {
            
            System.out.println("========================================");
            System.out.println("Agent Configuration Required");
            System.out.println("========================================");
            System.out.println("Please provide the following information from your database:");
            System.out.println();
            
            try (Scanner scanner = new Scanner(System.in)) {
                System.out.print("Enter Server ID (from servers table): ");
                String serverIdInput = scanner.nextLine().trim();
                Long serverId;
                try {
                    serverId = Long.parseLong(serverIdInput);
                } catch (NumberFormatException e) {
                    System.out.println("Invalid Server ID. Must be a number.");
                    System.exit(1);
                    return;
                }
                
                System.out.print("Enter Agent Token (from servers table): ");
                String agentToken = scanner.nextLine().trim();
                
                if (agentToken.isEmpty()) {
                    System.out.println("Agent Token cannot be empty.");
                    System.exit(1);
                    return;
                }
                
                config.setServerIdLong(serverId);
                config.setAuthToken(agentToken);
                
                try {
                    config.save(configPath);
                    System.out.println();
                    System.out.println("✓ Configuration saved to " + configPath);
                    System.out.println("✓ You won't need to enter these values again!");
                    System.out.println();
                } catch (Exception e) {
                    System.out.println("Failed to save configuration: " + e.getMessage());
                    System.exit(1);
                    return;
                }
            }
        }

        Agent agent;
        try {
            agent = Agent.newAgent(configPath);
        } catch (Exception ex) {
            System.out.printf("Failed to create agent: %s%n", ex.getMessage());
            System.exit(1);
            return;
        }

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("\nReceived shutdown signal...");
            agent.stop();
        }));

        agent.start();
    }
}
