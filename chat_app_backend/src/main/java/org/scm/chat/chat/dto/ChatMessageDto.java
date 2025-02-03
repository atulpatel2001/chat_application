package org.scm.chat.chat.dto;

import lombok.*;
import org.scm.chat.chat.model.ChatMessage;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ChatMessageDto {




    private String id;

    private String chatRoomId;

    private String senderId;


    private String receiverId; // This can be null for group messages

    private String message;

    private String timestamp;

    private ChatMessage.MessageStatus status = ChatMessage.MessageStatus.SENT;

    public enum MessageStatus {
        SENT,
        DELIVERED,
        READ
    }

    private String sender;

}
