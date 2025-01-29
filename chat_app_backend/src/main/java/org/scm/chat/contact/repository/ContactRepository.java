package org.scm.chat.contact.repository;

import org.scm.chat.contact.model.Contact;
import org.scm.chat.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact,Long> {

    Optional<Contact> findByUser(User user);

    Optional<Contact> findByEmail(String email);

    Optional<Contact> findByPhoneNumber(String phoneNumber);
}
