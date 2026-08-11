package com.url.shortner.controller;

import com.url.shortner.dtos.ClickEventDTO;
import com.url.shortner.dtos.UrlMappingDTO;
import com.url.shortner.models.User;
import com.url.shortner.services.UrlMappingService;
import com.url.shortner.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/urls")
@AllArgsConstructor
public class UrlMappingController {
    private UrlMappingService urlMappingService;
    private UserService userService;
    @PostMapping("/shorten")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<UrlMappingDTO> shortenUrl(@RequestBody Map<String, String> request,
                                                    Principal principal) {
        String originalUrl = request.get("originalUrl");
        User user=userService.findUserByUsername(principal.getName());
        UrlMappingDTO urlMappingDTO=urlMappingService.createShortUrl(originalUrl,user);
        return ResponseEntity.ok(urlMappingDTO);
    }

    @GetMapping("/myurls")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<UrlMappingDTO>> getMyUrls(Principal principal) {
        User user=userService.findUserByUsername(principal.getName());
        List<UrlMappingDTO> url=urlMappingService.getUrlsByUser(user);
        return ResponseEntity.ok(url);
    }



    @GetMapping("/analytics/{shortUrl}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<ClickEventDTO>> getUrlAnalytics(@PathVariable String shortUrl, @RequestParam("startDate") String startDate, @RequestParam("endDate")  String endDate ) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime startDateTime = LocalDateTime.parse(startDate, formatter);
        LocalDateTime endDateTime = LocalDateTime.parse(endDate, formatter);
        List<ClickEventDTO>clickEventDTOS= urlMappingService.getClickEventsByDate(shortUrl,startDateTime,endDateTime);
        return ResponseEntity.ok(clickEventDTOS);
    }

    @GetMapping("/totalClicks")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Map<LocalDate,Long>> getTotalClicksByDate(Principal principal, @RequestParam("startDate") String startDate, @RequestParam("endDate")  String endDate ) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
        User user=userService.findUserByUsername(principal.getName());
        LocalDate startDateTime = LocalDate.parse(startDate, formatter);
        LocalDate endDateTime = LocalDate.parse(endDate, formatter);
        Map<LocalDate,Long>totalClicks= urlMappingService.getTotalClicksByUserAndDate(user,startDateTime,endDateTime);
        return ResponseEntity.ok(totalClicks);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Void> deleteUrl(@PathVariable Long id, Principal principal) {
        User user = userService.findUserByUsername(principal.getName());
        urlMappingService.deleteUrl(id, user);
        return ResponseEntity.noContent().build();
    }
}
