package com.crm.dashboard.service;

import java.util.List;
import java.util.Map;
import com.crm.dashboard.model.Contact;

public interface ReportingService {
    Map<String, Long> getContactCountPerUser();
    List<Contact> getRecentContacts(int limit);
}

