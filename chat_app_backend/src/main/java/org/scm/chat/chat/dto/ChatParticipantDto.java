package org.scm.chat.chat.dto;

import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@Builder
public class ChatParticipantDto {

    private Long id;

    private UserDto user;

    private String joinedAt;

    private boolean isAdmin = false;



}
