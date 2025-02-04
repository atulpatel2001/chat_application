package org.scm.chat.chat.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class TypingMessage {


    private String chatRoomId;
    private String userId;
    private boolean typing;


}
