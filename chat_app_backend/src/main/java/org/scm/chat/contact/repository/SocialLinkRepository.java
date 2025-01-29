package org.scm.chat.contact.repository;

import org.scm.chat.contact.model.SocialLink;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SocialLinkRepository extends JpaRepository<SocialLink,String> {
}
