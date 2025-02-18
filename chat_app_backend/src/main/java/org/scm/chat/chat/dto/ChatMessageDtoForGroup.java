package org.scm.chat.chat.dto;

import lombok.*;
import org.scm.chat.chat.model.ChatMessage;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ChatMessageDtoForGroup {


    private String id;

    private String chatRoomId;

    private String senderId;


    private String receiverId; // This can be null for group messages

    private String message;

    private String timestamp;

    private String status = ChatMessage.MessageStatus.SENT.toString();

    private String sender;


    private UserDto senderUser;
    private UserDto receiverUser;


    private List<MessagesStatusDto> seenBy;

}
