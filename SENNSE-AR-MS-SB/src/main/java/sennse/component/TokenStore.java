package sennse.component;

import lombok.Data;
import org.springframework.stereotype.Component;

@Component
public class TokenStore {

    private String token;

    // Synchronized thread-safe access in case multiple threads use it
    public synchronized void setToken(String token){
        this.token = token;
    }

    public synchronized String getToken(){
        return token;
    }

    public boolean hasToken(){
        return token != null && !token.isEmpty();
    }
}