package com.example.TelConnect.service;

import com.example.TelConnect.DTO.SecretsCache;
import com.mailjet.client.ClientOptions;
import com.mailjet.client.errors.MailjetException;
import com.mailjet.client.MailjetClient;
import com.mailjet.client.MailjetRequest;
import com.mailjet.client.MailjetResponse;
import com.mailjet.client.resource.Emailv31;
import java.util.Random;


import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.TelConnect.repository.NotificationRepository;
import com.example.TelConnect.model.EmailContent;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.time.Instant;

@Service
public class EmailService {

    private final long OTP_EXPIRY_DURATION = 300_000;
    private final ConcurrentMap<String, OtpEntry> otpStore = new ConcurrentHashMap<>();
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;
    public EmailContent email;

    @Autowired
    private SecretsCache secretsCache;

    public EmailService(NotificationService notificationService, NotificationRepository notificationRepository, SecretsCache secretsCache){
        this.notificationRepository=notificationRepository;
        this.notificationService=notificationService;
        this.secretsCache = secretsCache;
    }

    private static class OtpEntry {
        private final int otp;
        private final long timestamp;

        public OtpEntry(int otp) {
            this.otp = otp;
            this.timestamp = Instant.now().toEpochMilli();
        }

        public int getOtp() {
            return otp;
        }

        public long getTimestamp() {
            return timestamp;
        }
    }

    //Method to generate new OTP
    public int generateOTP() {
        Random random = new Random();
        return 100000 + random.nextInt(900000); // 6-digit OTP
    }

    //Method to verify OTP
    public boolean verifyOTP(String recipient, int otp) {
        OtpEntry otpEntry = otpStore.get(recipient);

        if (otpEntry == null) {
            return false; // OTP doesn't exist for recipient
        }

        // Check if OTP is expired
        long currentTime = Instant.now().toEpochMilli();
        if (currentTime - otpEntry.getTimestamp() > OTP_EXPIRY_DURATION) {
            otpStore.remove(recipient); // Remove expired OTP
            return false; // OTP expired
        }

        // Check if OTP matches
        return otpEntry.getOtp() == otp;
    }

    //Method to generate welcome email
    public EmailContent WelcomeMessage(){
        EmailContent email= new EmailContent();
        email.setSubject("Welcome to TelConnect! Your Connection Starts Here");
        email.setTextPart("Welcome to TelConnect! We're thrilled to have you as part of our mission to help you stay connected with your family and the people who matter most. Thank you for choosing us to strengthen the bonds that bring your world closer together!");
        email.setHtmlPart(
                "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>\n" +
                        "   <h1 style='font-size: 24px; line-height: 32px;'>Your TelConnect Journey Begins</h1>\n" +
                        "   <p style='font-size: 16px; line-height: 22px;'>Congratulations on creating your TelConnect account! We're excited to connect you to the world around you.</p>\n" +
                        "   <br/><blockquote style='font-style: italic; font-size: 14px; margin: 20px 0; padding-left: 15px; border-left: 3px solid #ccc;'>\"Family is not an important thing. It's everything.\" - Michael J. Fox</blockquote>\n" +
                        "   <br/><p style='font-size: 16px; line-height: 22px;'>At TelConnect, we believe in strengthening family bonds through seamless communication. Explore our range of services to discover how we can enhance your connections.</p>\n" +
                        "   <br/><a href='https://www.telconnect.com/services' style='display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;'>View Our Services</a>\n" +
                        "</div>"
        );        return email;
    }

    //Method to generate email for OTP verification
    public EmailContent OTPMessage(int OTP){
        EmailContent email= new EmailContent();
        email.setSubject(OTP + " is your 2FA OTP");
        email.setTextPart("OTP to verify your email account is: "+ OTP);
        email.setHtmlPart( "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>\n" +
                "   <h1 style='font-size: 24px; line-height: 32px;'>Email Verification</h1>\n" +
                "   <p style='font-size: 16px; line-height: 22px;'>Your One-Time Password (OTP) is:</p>\n" +
                "   <h2 style='font-size: 36px; font-weight: bold; text-align: center;'>" + OTP + "</h2>\n" +
                "   <p style='font-size: 14px; color: #666; margin-top: 20px;'>If you did not initiate this request, someone may be trying to gain unauthorized access to your account.</p>\n" +
                "   <hr style='border: none; border-bottom: 1px solid #ccc; margin: 30px 0;' />\n" +
                "   <p style='font-size: 12px; color: #666;'>If you need assistance or have concerns about account security, please contact our support team at <a href='mailto:telConnecta@gmail.com'>telconnecta@gmail.com</a>.</p>\n" +
                "</div>"
        );
        return email;
    }

    //Method to generate thank you email after customer purchases a plan
    public EmailContent thankYouMessage(){
        EmailContent email= new EmailContent();
        email.setSubject("Thank You for Choosing TelConnect - Connecting You to What Matters!");
        email.setTextPart("Thank you for selecting TelConnect as your service provider! We appreciate your trust and are committed to delivering exceptional connectivity that brings you closer to the people who matter most. Your journey with us starts now, and we're here to ensure it’s a smooth ride!");
        email.setHtmlPart( "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>\n" +
                "   <h1 style='font-size: 24px; line-height: 32px;'>Welcome to our network!</h1>\n" +
                "   <p style='font-size: 16px; line-height: 22px;'>Thank you for choosing us as your telecom service provider! We're thrilled to have you on board and are committed to delivering exceptional connectivity that brings you closer to the people who matter most.</p>\n" +
                "   <p style='font-size: 16px; line-height: 22px;'>Your journey with TelConnect starts now, and we're dedicated to ensuring it's a smooth ride!</p>\n" +
                "   <hr style='border: none; border-bottom: 1px solid #ccc; margin: 30px 0;' />\n" +
                "   <p style='font-size: 12px;'>Stay connected, stay closer.<br/>Best regards,<br/>The TelConnect Team</p>\n" +
                "</div>");
        return email;
    }

    //Method to generate service activation mail after admin approves a customer's request
    public EmailContent ServiceActivationMessage(){
        EmailContent email= new EmailContent();
        email.setSubject("Service Activation");
        email.setTextPart("Your selected plan has been activated on your mobile number. Reach out to customer support if you are having trouble using our services.");
        email.setHtmlPart( "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>\n" +
                "   <h1 style='font-size: 24px; line-height: 32px;'>Your Connection Just Got Stronger</h1>\n" +
                "   <p style='font-size: 16px; line-height: 22px;'>Congratulations! You've taken an important step towards staying closer to those who matter most.</p>\n" +
                "   <p style='font-size: 16px; line-height: 22px;'>Your new service is now active, bringing you even closer to family, friends, and loved ones.</p>\n" +
                "   <p style='font-size: 14px; color: #666; margin-top: 20px;'>Need assistance? Our friendly support team is here to help. Just reply to this email or visit our support page.</p>\n" +
                "</div>");
        return email;
    }

    //Custom email sender method to package the email based on requirement
    public boolean customEmailSender(String type,Integer OTP, String recipient, String name) {
        EmailContent mail;
        switch (type.toLowerCase()) {
            case "welcome":
                mail= WelcomeMessage();
                try{
                    sendMail(mail,recipient,name);
                    return true;
                }catch(Exception e){
                    e.printStackTrace();
                }
                break;

            case "otp":
                if (OTP != 0) {
                    mail= OTPMessage( OTP);
                    try {
                        sendMail(mail,recipient,name);
                        otpStore.put(recipient, new OtpEntry(OTP));
                        return true;
                    }catch(Exception e){
                        e.printStackTrace();
                    }
                    break;
                } else {
                    System.out.println("No OTP ");
                }

            case "thankyou":
                mail= thankYouMessage();
                try{
                    sendMail(mail,recipient,name);
                    return true;
                } catch (MailjetException e) {
                    e.printStackTrace();
                }
                break;

            case "serviceactivation":
                mail=ServiceActivationMessage();
                try{
                    sendMail(mail,recipient,name);
                    return true;
                } catch (MailjetException e) {
                    e.printStackTrace();
                }

            default:
                System.out.println("Error");
                return false;
        }
        return false;
    }

    //Method to fire the email using MailJet API
    //Here we use MailJet's API to invoke the mailjet client using the secret key and access key
    //After retrieving the email contents from the EmailContent object we make a post request
    public void sendMail(EmailContent email, String recipient, String name) throws MailjetException, NullPointerException {

        String api_key= secretsCache.getSecret("APIKEY");
        String secret_key= secretsCache.getSecret("SECRETKEY");
        MailjetClient client = new MailjetClient(ClientOptions.builder()
                .apiKey(api_key)
                .apiSecretKey(secret_key)
                .build());
        MailjetRequest request = new MailjetRequest(Emailv31.resource)
                .property(Emailv31.MESSAGES, new JSONArray()
                        .put(new JSONObject()
                                .put(Emailv31.Message.FROM, new JSONObject()
                                        .put("Email", "telconnecta@gmail.com")
                                        .put("Name", "Telconnect admin"))
                                .put(Emailv31.Message.TO, new JSONArray()
                                        .put(new JSONObject()
                                                .put("Email", recipient)
                                                .put("Name", name)))
                                .put(Emailv31.Message.SUBJECT, email.getSubject())
                                .put(Emailv31.Message.TEXTPART, email.getTextPart())
                                .put(Emailv31.Message.HTMLPART, email.getHtmlPart())
                                .put(Emailv31.Message.CUSTOMID, "PushEmail")));
        MailjetResponse response = client.post(request);
        System.out.println(response.getStatus());
        System.out.println(response.getData());
    }

}
