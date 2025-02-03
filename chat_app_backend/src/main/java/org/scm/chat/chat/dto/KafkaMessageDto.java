package org.scm.chat.chat.dto;

import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class KafkaMessageDto {
    private String id;
    private String chatRoomId;
    private String senderId;
    private String receiverId;
    private String message;
    private String timestamp;
    private String status;
}
