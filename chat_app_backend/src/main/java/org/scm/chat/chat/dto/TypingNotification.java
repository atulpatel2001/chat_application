package org.scm.chat.chat.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class TypingNotification {
    private String userId;
    private String chatRoomId;
    private String userName;
    private boolean typing;

}