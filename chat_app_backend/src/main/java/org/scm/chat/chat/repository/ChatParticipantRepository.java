package org.scm.chat.chat.repository;

import org.scm.chat.chat.model.ChatParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatParticipantRepository extends JpaRepository<ChatParticipant,Long> {
}
