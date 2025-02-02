package org.scm.chat.contact.repository;

import org.scm.chat.contact.model.Contact;
import org.scm.chat.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact,Long> {

    Optional<List<Contact>> findByUserAndIsDeletedFalse(User user);

    Optional<Contact> findByEmailAndIsDeletedFalse(String email);

    Optional<Contact> findByPhoneNumberAndIsDeletedFalse(String phoneNumber);

    Optional<Contact> findByEmailAndUserAndIsDeletedFalse(String email, User user);
    Optional<Contact> findByPhoneNumberAndUserAndIsDeletedFalse(String phoneNumber, User user);

    @Query(value = "select * from contacts where user_id =:userId AND contactUserId =:contactUserId and isDeleted =false",nativeQuery = true)
    Optional<List<Contact>> findByUserIdAndContactUserId(Long userId, Long contactUserId);
}
