package org.scm.chat.chat.dto;

import lombok.Data;
import lombok.ToString;
import org.scm.chat.chat.model.ChatMessage;

@Data
@ToString
public class ChatMessageDtoForGroup {


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


    private UserDto senderUser;
    private UserDto receiverUser;

}
