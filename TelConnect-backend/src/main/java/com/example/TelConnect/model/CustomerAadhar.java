package com.example.TelConnect.model;
import jakarta.persistence.*;


@Entity
@Table(name = "customer_aadhar")
public class CustomerAadhar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name ="customer_id", referencedColumnName = "customerId" , nullable = false)
    private Customer customer;

    @Column
    private String customerName;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public CustomerAadhar() {
    }
}