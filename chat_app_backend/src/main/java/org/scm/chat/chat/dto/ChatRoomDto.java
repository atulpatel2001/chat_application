package org.scm.chat.chat.dto;


import lombok.Builder;
import lombok.Data;
import lombok.ToString;

import java.util.List;
@Data
@ToString
@Builder
public class ChatRoomDto {


    private Long id;

    private String type;

    private String name;

    private String groupImage;

    private List<ChatParticipantDto> participants;

}
