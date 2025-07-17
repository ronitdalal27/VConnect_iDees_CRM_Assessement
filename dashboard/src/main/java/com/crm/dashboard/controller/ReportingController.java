package com.crm.dashboard.controller;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.crm.dashboard.model.Contact;
import com.crm.dashboard.service.ReportingService;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportingController {

    @Autowired
    private ReportingService reportingService;

    @GetMapping("/contact-count")
    public Map<String, Long> getContactCountPerUser() {
        return reportingService.getContactCountPerUser();
    }

    @GetMapping("/recent-contacts")
    public List<Contact> getRecentContacts() {
        return reportingService.getRecentContacts(5);
    }
}
