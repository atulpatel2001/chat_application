package org.scm.chat.chat.dto;

import lombok.Data;

@Data
public class ChatStatusUpdateDto {


    private  String chatRoomId;

    private String userId;

    private String status;
}
