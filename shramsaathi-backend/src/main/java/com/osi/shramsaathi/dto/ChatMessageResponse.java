package com.osi.shramsaathi.dto;

import java.time.LocalDateTime;

public class ChatMessageResponse {

    private Long id;
    private Long senderId;
    private Long receiverId;
    private Long applicationId;
    private String message;
    private LocalDateTime sentAt;
    private Boolean read;

    public ChatMessageResponse(
            Long id,
            Long senderId,
            Long receiverId,
            Long applicationId,
            String message,
            LocalDateTime sentAt,
            Boolean read) {

        this.id = id;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.applicationId = applicationId;
        this.message = message;
        this.sentAt = sentAt;
        this.read = read;
    }



    public Long getId() {
        return id;
    }

    public Long getSenderId() {
        return senderId;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public Boolean getRead() {
        return read;
    }
}