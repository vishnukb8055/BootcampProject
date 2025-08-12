package com.example.TelConnect.security;

import com.example.TelConnect.model.Customer;
import com.example.TelConnect.repository.CustomerRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CustomCustomerDetailsService implements UserDetailsService {

    private final CustomerRepository customerRepository;

    public CustomCustomerDetailsService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Customer customer = customerRepository.findByCustomerEmail(email);

        if (customer != null) {
            Set<GrantedAuthority> authorities = customer.getRole().stream()
                    .map((role) -> new SimpleGrantedAuthority(role.getRoleName()))
                    .collect(Collectors.toSet());

            return new org.springframework.security.core.userdetails.User(
                    customer.getCustomerEmail(),
                    customer.getPassword(),
                    authorities
            );
        } else {
            throw new UsernameNotFoundException("Invalid username or password.");
        }
    }

}
