package org.scm.chat.chat.repository;

import org.scm.chat.chat.model.MessagesStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageStatusRepository extends JpaRepository<MessagesStatus,Long> {
}
