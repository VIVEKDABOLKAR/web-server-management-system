package wsms.agent.utils;

import java.util.LinkedHashMap;
import java.util.Map;

public final class JsonUtils {
    private JsonUtils() {
    }

    public static Map<String, Object> parseFlatObject(String json) {
        return new Parser(json).parseObject();
    }

    public static String toJson(Map<String, ?> values) {
        return writeObject(values, false);
    }

    public static String toPrettyJson(Map<String, ?> values) {
        return writeObject(values, true);
    }

    private static String writeObject(Map<String, ?> values, boolean pretty) {
        StringBuilder builder = new StringBuilder();
        builder.append('{');
        if (pretty && !values.isEmpty()) {
            builder.append('\n');
        }

        int index = 0;
        for (Map.Entry<String, ?> entry : values.entrySet()) {
            if (index > 0) {
                builder.append(',');
                if (pretty) {
                    builder.append('\n');
                }
            }

            if (pretty) {
                builder.append("  ");
            }
            builder.append('"').append(escape(entry.getKey())).append('"').append(':');
            if (pretty) {
                builder.append(' ');
            }
            builder.append(writeValue(entry.getValue()));
            index++;
        }

        if (pretty && !values.isEmpty()) {
            builder.append('\n');
        }
        builder.append('}');
        return builder.toString();
    }

    private static String writeValue(Object value) {
        if (value == null) {
            return "null";
        }
        if (value instanceof String stringValue) {
            return '"' + escape(stringValue) + '"';
        }
        if (value instanceof Number || value instanceof Boolean) {
            return String.valueOf(value);
        }
        throw new IllegalArgumentException("Unsupported JSON value type: " + value.getClass().getName());
    }

    private static String escape(String value) {
        StringBuilder builder = new StringBuilder();
        for (int index = 0; index < value.length(); index++) {
            char current = value.charAt(index);
            switch (current) {
                case '\\' -> builder.append("\\\\");
                case '"' -> builder.append("\\\"");
                case '\b' -> builder.append("\\b");
                case '\f' -> builder.append("\\f");
                case '\n' -> builder.append("\\n");
                case '\r' -> builder.append("\\r");
                case '\t' -> builder.append("\\t");
                default -> {
                    if (current < 0x20) {
                        builder.append(String.format("\\u%04x", (int) current));
                    } else {
                        builder.append(current);
                    }
                }
            }
        }
        return builder.toString();
    }

    private static final class Parser {
        private final String input;
        private int index;

        private Parser(String input) {
            this.input = input == null ? "" : input;
        }

        private Map<String, Object> parseObject() {
            skipWhitespace();
            expect('{');
            Map<String, Object> values = new LinkedHashMap<>();
            skipWhitespace();
            if (peek('}')) {
                index++;
                return values;
            }

            while (index < input.length()) {
                skipWhitespace();
                String key = parseString();
                skipWhitespace();
                expect(':');
                skipWhitespace();
                values.put(key, parseValue());
                skipWhitespace();

                if (peek(',')) {
                    index++;
                    continue;
                }
                if (peek('}')) {
                    index++;
                    return values;
                }
                throw error("Expected ',' or '}'");
            }

            throw error("Unexpected end of JSON object");
        }

        private Object parseValue() {
            if (peek('"')) {
                return parseString();
            }
            if (peek('t')) {
                expectLiteral("true");
                return Boolean.TRUE;
            }
            if (peek('f')) {
                expectLiteral("false");
                return Boolean.FALSE;
            }
            if (peek('n')) {
                expectLiteral("null");
                return null;
            }
            if (peek('{') || peek('[')) {
                throw error("Nested JSON values are not supported");
            }
            return parseNumber();
        }

        private Number parseNumber() {
            int start = index;
            if (peek('-')) {
                index++;
            }
            while (index < input.length() && Character.isDigit(input.charAt(index))) {
                index++;
            }
            if (peek('.')) {
                index++;
                while (index < input.length() && Character.isDigit(input.charAt(index))) {
                    index++;
                }
            }
            if (peek('e') || peek('E')) {
                index++;
                if (peek('+') || peek('-')) {
                    index++;
                }
                while (index < input.length() && Character.isDigit(input.charAt(index))) {
                    index++;
                }
            }

            String token = input.substring(start, index);
            try {
                if (token.contains(".") || token.contains("e") || token.contains("E")) {
                    return Double.parseDouble(token);
                }
                return Long.parseLong(token);
            } catch (NumberFormatException ex) {
                throw error("Invalid number: " + token);
            }
        }

        private String parseString() {
            expect('"');
            StringBuilder builder = new StringBuilder();
            while (index < input.length()) {
                char current = input.charAt(index++);
                if (current == '"') {
                    return builder.toString();
                }
                if (current == '\\') {
                    if (index >= input.length()) {
                        throw error("Invalid escape sequence");
                    }
                    char escape = input.charAt(index++);
                    switch (escape) {
                        case '"' -> builder.append('"');
                        case '\\' -> builder.append('\\');
                        case '/' -> builder.append('/');
                        case 'b' -> builder.append('\b');
                        case 'f' -> builder.append('\f');
                        case 'n' -> builder.append('\n');
                        case 'r' -> builder.append('\r');
                        case 't' -> builder.append('\t');
                        case 'u' -> builder.append(parseUnicode());
                        default -> throw error("Unsupported escape sequence: \\" + escape);
                    }
                    continue;
                }
                builder.append(current);
            }
            throw error("Unterminated string");
        }

        private char parseUnicode() {
            if (index + 4 > input.length()) {
                throw error("Invalid unicode escape sequence");
            }
            String hex = input.substring(index, index + 4);
            index += 4;
            try {
                return (char) Integer.parseInt(hex, 16);
            } catch (NumberFormatException ex) {
                throw error("Invalid unicode escape sequence: " + hex);
            }
        }

        private void expectLiteral(String literal) {
            if (!input.regionMatches(index, literal, 0, literal.length())) {
                throw error("Expected '" + literal + "'");
            }
            index += literal.length();
        }

        private void expect(char expected) {
            if (index >= input.length() || input.charAt(index) != expected) {
                throw error("Expected '" + expected + "'");
            }
            index++;
        }

        private boolean peek(char expected) {
            return index < input.length() && input.charAt(index) == expected;
        }

        private void skipWhitespace() {
            while (index < input.length() && Character.isWhitespace(input.charAt(index))) {
                index++;
            }
        }

        private IllegalArgumentException error(String message) {
            return new IllegalArgumentException(message + " at position " + index);
        }
    }
}