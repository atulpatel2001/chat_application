package org.scm.chat.chat.dto;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;


import java.time.LocalDateTime;
@Data
@Builder
@ToString
public class MessagesStatusDto {

    private Long id;

    private UserDto user;  // The user who saw the message

    private LocalDateTime seenAt;  // When the u
    private String status;
}
