package com.example.TelConnect.model;

public class EmailContent {
    private String subject;
    private String textPart;
    private String htmlPart;
    private String recipientEmail;
    private String recipientName;

    public EmailContent() {}

    public EmailContent(String subject, String textPart, String htmlPart) {
        this.subject = subject;
        this.textPart = textPart;
        this.htmlPart = htmlPart;

    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getTextPart() {
        return textPart;
    }

    public void setTextPart(String textPart) {
        this.textPart = textPart;
    }

    public String getHtmlPart() {
        return htmlPart;
    }

    public void setHtmlPart(String htmlPart) {
        this.htmlPart = htmlPart;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    @Override
    public String toString() {
        return "EmailContent{" +
                "subject='" + subject + '\'' +
                ", textPart='" + textPart + '\'' +
                ", htmlPart='" + htmlPart + '\'' +
                ", recipientEmail='" + recipientEmail + '\'' +
                ", recipientName='" + recipientName + '\'' +
                '}';
    }
}
