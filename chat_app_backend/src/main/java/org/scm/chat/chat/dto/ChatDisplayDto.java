package org.scm.chat.chat.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ChatDisplayDto {

    private Long roomId;
    private String name;

    private String lastMessage;

    private String lastMessageTime;

    private String profilePic;
}
