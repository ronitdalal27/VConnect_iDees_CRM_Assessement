package com.crm.dashboard.service;

import java.util.List;
import com.crm.dashboard.model.Contact;

public interface ContactService {
    List<Contact> getAllContacts();
    Contact getContactById(Long id);
    Contact createContact(Contact contact);
    Contact updateContact(Long id, Contact contact);
    void deleteContact(Long id);
    List<Contact> searchContacts(String query);
}
