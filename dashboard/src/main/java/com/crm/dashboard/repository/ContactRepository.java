package com.crm.dashboard.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.crm.dashboard.model.Contact;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String email);
}
