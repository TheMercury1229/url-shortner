package com.url.shortner.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UrlMappingDTO {
    private String originalUrl;
    private String shortUrl;
    private long id;
    private  int clickCount;
    private LocalDateTime createdDate;
    private String username;
}
