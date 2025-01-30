package org.scm.chat.contact.repository;

import org.scm.chat.contact.model.Contact;
import org.scm.chat.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact,Long> {

    Optional<List<Contact>> findByUserAndIsDeletedFalse(User user);

    Optional<Contact> findByEmail(String email);

    Optional<Contact> findByPhoneNumber(String phoneNumber);

    Optional<Contact> findByEmailAndUser(String email, User user);
    Optional<Contact> findByPhoneNumberAndUser(String phoneNumber, User user);
}
