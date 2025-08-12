package com.example.TelConnect.config;

import com.example.TelConnect.DTO.SecretsCache;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.vault.core.VaultTemplate;
import org.springframework.vault.support.VaultResponse;

import java.util.Map;

@Component
public class VaultSecretLoader {

    @Autowired
    private VaultTemplate vaultTemplate;

    @Autowired
    private SecretsCache secretsCache;

    @PostConstruct
    public void init(){
        loadSecretsFromVault("MJ");
    }

    private void loadSecretsFromVault(String path){
        VaultResponse response = vaultTemplate.read("secret/telconnect/data/" + path);
        if(response != null && response.getData() != null){
            Map<String, Object> data = (Map<String, Object>) response.getData().get("data");
            if(data !=null){
                data.forEach((key, value)->{
                    secretsCache.putSecret(key, value.toString());
                    System.out.println("Loaded secret: " + key);
                });
            }
        }
        else
            throw new RuntimeException("Failed to load secrets from Vault ");
    }
}
