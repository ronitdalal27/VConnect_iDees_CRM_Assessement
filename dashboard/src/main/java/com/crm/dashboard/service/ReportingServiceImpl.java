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

        return contacts.stream() //convert the list of contacts to a stream
                       .filter(c -> c.getUser() != null) //filter out contacts without a user
                       .collect(Collectors.groupingBy( //group by user name
                                c -> c.getUser().getName(),
                                Collectors.counting() //count the number of contacts per user
                       ));
    }

    @Override
    public List<Contact> getRecentContacts(int limit) {
        return contactRepository.findAll().stream() //convert the list of contacts to a stream
                .sorted((c1, c2) -> c2.getCreatedAt().compareTo(c1.getCreatedAt())) //sort by creation date in descending order
                .limit(limit) //limit the results to the specified number
                .collect(Collectors.toList()); //collect the results back to a list
    }
}
