package org.scm.chat.chat.dto;


import lombok.*;

import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString

public class UserChatContactData {

    private ChatDisplayDto singleEmployee;

    private List<ChatDisplayDto> chatDisplayDtos;

    private  List<ChatMessageDto> chatMessageDtos;
}
