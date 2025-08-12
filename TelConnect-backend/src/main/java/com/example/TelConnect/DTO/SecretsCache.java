package com.example.TelConnect.DTO;
import org.springframework.stereotype.Component;

import java.util.HashMap;

@Component
public class SecretsCache {

    private HashMap<String,String> secretsCache= new HashMap<>();

    public HashMap<String, String> getSecretsCache() {
        return secretsCache;
    }

    public String getSecret(String key){
        return secretsCache.get(key);
    }

    public void putSecret(String key, String value){
        secretsCache.put(key, value);
    }

    public void setSecretsCache(HashMap<String, String> secretsCache) {
        this.secretsCache = secretsCache;
    }
}
