package com.crm.dashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.crm.dashboard.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    //there was no need for additional user-specific methods in this context, so i had not implemented any.
}
