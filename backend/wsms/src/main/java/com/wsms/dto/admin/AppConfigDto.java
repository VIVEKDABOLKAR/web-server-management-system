package com.wsms.dto.admin;

public class AppConfigDto {
    private boolean allowWebClientRequests;
    private boolean emailServiceEnabled;
    private String serverAgentJarUrl;
    private boolean showTerminalOnServerSetup;

    public boolean isAllowWebClientRequests() {
        return allowWebClientRequests;
    }

    public void setAllowWebClientRequests(boolean allowWebClientRequests) {
        this.allowWebClientRequests = allowWebClientRequests;
    }

    public boolean isEmailServiceEnabled() {
        return emailServiceEnabled;
    }

    public void setEmailServiceEnabled(boolean emailServiceEnabled) {
        this.emailServiceEnabled = emailServiceEnabled;
    }

    public String getServerAgentJarUrl() {
        return serverAgentJarUrl;
    }

    public void setServerAgentJarUrl(String serverAgentJarUrl) {
        this.serverAgentJarUrl = serverAgentJarUrl;
    }

    public boolean isShowTerminalOnServerSetup() {
        return showTerminalOnServerSetup;
    }

    public void setShowTerminalOnServerSetup(boolean showTerminalOnServerSetup) {
        this.showTerminalOnServerSetup = showTerminalOnServerSetup;
    }
}
