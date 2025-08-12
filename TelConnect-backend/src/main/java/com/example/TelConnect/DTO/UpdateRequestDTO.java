package com.example.TelConnect.DTO;

import java.time.LocalDate;

public class UpdateRequestDTO {
    private LocalDate customerDOB;
    private String customerAddress;
    private String password;
    private String customerEmail;

    public String getCustomerEmail(){
        return customerEmail;
    }

    public void setCustomerEmail(String email){
        this.customerEmail=email;
    }

    public String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public LocalDate getCustomerDOB() {
        return customerDOB;
    }

    public void setCustomerDOB(LocalDate customerDOB) {
        this.customerDOB = customerDOB;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
