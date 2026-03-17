package wsms.agent.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.Map;

public class ConfigUtils {
    private static final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    //create default config file
    public static Config defaultConfig() {
        return new Config();
    }

    //load config from Json file
    //ToDo :- instead of default config send error
    public static Config loadConfig(String path) {
        Path configPath = Path.of(path);

        if (!Files.exists(configPath)) {
            return defaultConfig();
        }

        try {
            Config config = mapper.readValue(configPath.toFile(), Config.class);
//            ConfigValidator.validate(config);
            return config;

        } catch (Exception e) {
            System.out.println("Config load failed: " + e.getMessage());
            return defaultConfig();
        }
    }

    //save config to JSON file
    public static Config saveConfigArgs(Map<String,String> args, String path) {
        Config config = loadConfig(path);

        //extract args and put in config
        if (args.containsKey("serverId")) {
            config.setServerId(args.get("serverId"));
        }

        if (args.containsKey("serverName")) {
            config.setServerName(args.get("serverName"));
        }

        if (args.containsKey("agentToken")) {
            config.setAuthToken(args.get("agentToken"));
        }

        if (args.containsKey("backendUrl")) {
            config.setBackendUrl(args.get("backendUrl"));
        }

        if (args.containsKey("collectionInterval")) {
            config.setCollectionInterval(
                    Duration.ofSeconds(Long.parseLong(args.get("collectionInterval")))
            );
        }

        try {
            mapper.writerWithDefaultPrettyPrinter()
                    .writeValue(Paths.get(path).toFile(), config);
        } catch (Exception e) {
            System.out.println("Config save failed: " + e.getMessage());
        }

        return config;
    }
}
