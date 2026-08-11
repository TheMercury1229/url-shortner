package com.url.shortner.repository;

import com.url.shortner.dtos.ClickEventDTO;
import com.url.shortner.models.ClickEvent;
import com.url.shortner.models.UrlMapping;
import com.url.shortner.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ClickEventRepository extends JpaRepository<ClickEvent, Long> {
   List<ClickEvent> findByUrlMappingAndClickDateBetween(UrlMapping urlMapping,LocalDateTime startDateTime, LocalDateTime endDateTime);
   List<ClickEvent> findByUrlMappingInAndClickDateBetween(List<UrlMapping> urlMappings, LocalDateTime startDateTime, LocalDateTime endDateTime);


}
