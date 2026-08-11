package com.url.shortner.security.jwt;

import com.url.shortner.services.UserDetailsImpl;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.stream.Collectors;

@Service
public class JwtUtils {
    @Value("${jwt.secret}")
    private String jwtSecret;
    @Value("${jwt.expiration}")
    private int jwtExpirationMs;
//    Authorization -> Bearer <Token>
    public String getJwtFromHeader(HttpServletRequest header) {
        String bearerToken = header.getHeader("Authorization");
        if(bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
   public String getUsernameFromJwtToken(String token) {
        return Jwts.parser().verifyWith((SecretKey) key() ).build().parseSignedClaims(token).getPayload().getSubject();
   }
    public String generateToken(UserDetailsImpl userDetails){
        String username=userDetails.getUsername();
        String role=userDetails.getAuthorities().stream().map(authority->authority.getAuthority()).collect(Collectors.joining(","));
        return Jwts.builder().subject(username).claim("roles",role)
                .issuedAt(new Date())
                .expiration(new Date((new Date().getTime()+jwtExpirationMs)))
                .signWith(key())
                .compact();
    }

    private Key key(){
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith((SecretKey) key())
                    .build()
                    .parseSignedClaims(token);

            return true;

        } catch (JwtException e) {
            throw new RuntimeException(e);

        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
