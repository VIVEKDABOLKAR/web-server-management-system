package com.wsms.entity;

public enum ServerStatus {
    ACTIVE,
    INACTIVE,
    UNKNOWN, // WHEN OUR AGENT IS DOWN - WE CAN NOT DETERMINE IF SERVER IS UP OR DOWN

    // REMOVED WARNING, ERROR, BLOCKED TYPE - AS of these are server health field
}

