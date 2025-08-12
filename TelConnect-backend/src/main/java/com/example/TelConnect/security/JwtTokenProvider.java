package com.example.TelConnect.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

import javax.crypto.SecretKey;
import java.security.Key;

@Component
public class JwtTokenProvider {

    public String generateToken(Authentication authentication) {

        String name = authentication.getName();
        Date currentDate= new Date();

        Date expireDate= new Date(currentDate.getTime() + 604800000);

        return Jwts.builder()
                .claims()
                .subject(name)
                .issuedAt(new Date())
                .expiration(expireDate)
                .and()
                .signWith(key())
                .compact();
    }

    private Key key(){
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode("daf66e01593f61a15b857cf433aae03a005812b31234e149036bcc8dee755dbb"));
    }

    public String getUserName(String token){
        return Jwts.parser()
                .verifyWith((SecretKey) key())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token) throws ExpiredJwtException{
        Jwts.parser()
                .verifyWith((SecretKey) key())
                .build()
                .parse(token);
        return true;
    }
}
