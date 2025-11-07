package com.crm.dashboard.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.crm.dashboard.model.Contact;
import com.crm.dashboard.model.User;
import com.crm.dashboard.repository.ContactRepository;
import com.crm.dashboard.repository.UserRepository;

@Service
public class ContactServiceImpl implements ContactService {

    @Autowired
    private ContactRepository contactRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    @Override
    public Contact getContactById(Long id) {
        return contactRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Contact not found"));
    }

    @Override
    public Contact createContact(Contact contact) {
        Long userId = contact.getUser().getId();
        User user = userRepository.findById(userId)
                                  .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        contact.setUser(user);
        return contactRepository.save(contact);
    }
    
    @Override
    public Contact updateContact(Long id, Contact contactDetails) {
        Contact existing = getContactById(id);
        existing.setName(contactDetails.getName());
        existing.setEmail(contactDetails.getEmail());
        existing.setPhone(contactDetails.getPhone());

        Long userId = contactDetails.getUser().getId();
        User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        existing.setUser(user);

        return contactRepository.save(existing);
    }

    @Override
    public void deleteContact(Long id) {
        contactRepository.deleteById(id);
    }

    @Override
    public List<Contact> searchContacts(String query) {
        return contactRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query);
    }
}
