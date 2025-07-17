package com.crm.dashboard.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.crm.dashboard.model.Contact;
import com.crm.dashboard.repository.ContactRepository;

@Service
public class ReportingServiceImpl implements ReportingService {

    @Autowired
    private ContactRepository contactRepository;

    @Override
    public Map<String, Long> getContactCountPerUser() {
        List<Contact> contacts = contactRepository.findAll();

        return contacts.stream()
                .filter(c -> c.getUser() != null)
                .collect(Collectors.groupingBy(
                        c -> c.getUser().getName(),
                        Collectors.counting()
                ));
    }

    @Override
    public List<Contact> getRecentContacts(int limit) {
        return contactRepository.findAll().stream()
                .sorted((c1, c2) -> c2.getCreatedAt().compareTo(c1.getCreatedAt()))
                .limit(limit)
                .collect(Collectors.toList());
    }
}
