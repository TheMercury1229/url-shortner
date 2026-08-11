package com.url.shortner.services;

import com.url.shortner.dtos.ClickEventDTO;
import com.url.shortner.dtos.UrlMappingDTO;
import com.url.shortner.models.ClickEvent;
import com.url.shortner.models.UrlMapping;
import com.url.shortner.models.User;
import com.url.shortner.repository.ClickEventRepository;
import com.url.shortner.repository.UrlMappingRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UrlMappingService {
    private UrlMappingRepository urlMappingRepository;
    private ClickEventRepository clickEventRepository;
    public UrlMappingDTO createShortUrl(String originalUrl, User currentUser){
        String shortUrl=generateShortUrl();
        UrlMapping urlMapping=new UrlMapping();
        urlMapping.setOriginalUrl(originalUrl);
        urlMapping.setShortUrl(shortUrl);
        urlMapping.setUser(currentUser);
        urlMapping.setCreatedDate(LocalDateTime.now());
        UrlMapping savedUrlMapping =urlMappingRepository.save(urlMapping);
        return convertToUrlMappingDTO(savedUrlMapping);
    }
    private String generateShortUrl(){
        Random random = new Random();
        String characters="ABCDEFGHIJKLMNOPQURSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder shortUrl=new StringBuilder(8);
        for(int i=0;i<8;i++){
            shortUrl.append(characters.charAt(random.nextInt(characters.length())));
        }
        return shortUrl.toString();
    }

    private UrlMappingDTO convertToUrlMappingDTO(UrlMapping urlMapping){
        UrlMappingDTO urlMappingDTO=new UrlMappingDTO();
        urlMappingDTO.setOriginalUrl(urlMapping.getOriginalUrl());
        urlMappingDTO.setClickCount(urlMapping.getClickCount());
        urlMappingDTO.setId(urlMapping.getId());
        urlMappingDTO.setUsername(urlMapping.getUser().getUsername());
        urlMappingDTO.setShortUrl(urlMapping.getShortUrl());
        urlMappingDTO.setCreatedDate(urlMapping.getCreatedDate());
        return urlMappingDTO;
    }

    public List<UrlMappingDTO> getUrlsByUser(User user){
        return urlMappingRepository.findByUser(user).stream().map(this::convertToUrlMappingDTO).toList();

    }

    public List<ClickEventDTO> getClickEventsByDate(String shortUrl, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        UrlMapping urlMapping=urlMappingRepository.findByShortUrl(shortUrl);
        if(urlMapping!=null){
            return clickEventRepository.findByUrlMappingAndClickDateBetween(urlMapping,startDateTime,endDateTime).stream().collect(Collectors.groupingBy(click->click.getClickDate().toLocalDate(),Collectors.counting())).entrySet().stream().map(entry->{
                ClickEventDTO clickEventDTO=new ClickEventDTO();
                clickEventDTO.setClickDate(entry.getKey().atStartOfDay());
                clickEventDTO.setCount(entry.getValue());
                return clickEventDTO;
            }).collect(Collectors.toList());
        }
        return null;
    }

    public Map<LocalDate, Long> getTotalClicksByUserAndDate(User user, LocalDate startDateTime, LocalDate endDateTime) {
        List<UrlMapping>urlMappings=urlMappingRepository.findByUser(user);
        List<ClickEvent> clickEvents=clickEventRepository.findByUrlMappingInAndClickDateBetween(urlMappings,startDateTime.atStartOfDay(),endDateTime.plusDays(1).atStartOfDay());
        return clickEvents.stream().collect(Collectors.groupingBy(click->click.getClickDate().toLocalDate(),Collectors.counting()));
    }

    public UrlMapping getOriginalUrl(String shortUrl) {
        UrlMapping urlMapping=urlMappingRepository.findByShortUrl(shortUrl);
        if(urlMapping!=null){
            urlMapping.setClickCount(urlMapping.getClickCount()+1);
            urlMappingRepository.save(urlMapping);
            ClickEvent clickEvent=new ClickEvent();
            clickEvent.setClickDate(LocalDateTime.now());
            clickEvent.setUrlMapping(urlMapping);
            clickEventRepository.save(clickEvent);
        }
        return urlMapping;
    }

    public void deleteUrl(Long id, User user) {
        UrlMapping urlMapping = urlMappingRepository.findById(id).orElse(null);
        if (urlMapping != null && urlMapping.getUser().getId() == user.getId()) {
            urlMappingRepository.delete(urlMapping);
        } else {
            throw new IllegalArgumentException("Unauthorized or URL not found");
        }
    }
}
