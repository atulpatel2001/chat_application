package org.scm.chat.chat.dto;

import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import org.scm.chat.chat.model.ChatMessage;
import org.scm.chat.user.model.User;

import java.time.LocalDateTime;

public class MessagesStatusDto {

    private Long id;

    private UserDto user;  // The user who saw the message

    private LocalDateTime seenAt;  // When the u
}
