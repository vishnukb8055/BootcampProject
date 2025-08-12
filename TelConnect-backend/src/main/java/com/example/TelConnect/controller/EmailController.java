package com.example.TelConnect.controller;

import com.example.TelConnect.service.EmailService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Tag(name= "Email", description = "Email operations")
@RestController
@RequestMapping("/api/emails")
public class EmailController {
    private final EmailService emailService;

    @Autowired
    public EmailController( EmailService emailService) {
        this.emailService= emailService;
    }

    //Handler to push welcome email
    @PostMapping("/welcome")
    public ResponseEntity<String> welcomeMailSender(@RequestParam String recipient,@RequestParam String name){
        if(emailService.customEmailSender("welcome",0,recipient,name))
            return ResponseEntity.ok().body("Email sent");
        else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error sending mail");
    }

    //Handler to push OTP mail
    @PostMapping("/OTP")
    public ResponseEntity<String> OTPMailSender(@RequestParam String recipient, @RequestParam String name){
        int otp=emailService.generateOTP();
        if(emailService.customEmailSender("otp",otp,recipient,name))
            return ResponseEntity.ok().body("Email sent");
        else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error sending mail");
    }

    //Handler to push thank-you mail
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/thank-you")
    public ResponseEntity<String> thankYouSender(@RequestParam String recipient, @RequestParam String name){
        if(emailService.customEmailSender("thankyou",0,recipient,name))
            return ResponseEntity.ok().body("Email sent");
        else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error sending mail");
    }

    //Handler to push service activation mail
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/service-activation")
    public ResponseEntity<String> activationSender(@RequestParam String recipient,@RequestParam String name){
        if(emailService.customEmailSender("serviceactivation",0,recipient,name))
            return ResponseEntity.ok().body("Email sent");
        else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error sending mail");
    }

    //Handler to verify OTP submitted
    @PostMapping("/otp/verify")
    public ResponseEntity<String> verifyOTP(@RequestParam String recipient, @RequestParam int otp) {
        if (emailService.verifyOTP(recipient, otp)) {
            return ResponseEntity.ok().body("OTP verified successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP");
        }
    }
}
