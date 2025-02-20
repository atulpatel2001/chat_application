package org.scm.chat.chat.dto;

import lombok.Builder;
import lombok.Data;
import lombok.ToString;

import java.util.List;
@Data
@ToString
@Builder
public class UpdateStatusDto {

    private  List<ChatMessageDtoForGroup> messageDtoForGroupList;
    private UserDto userDto;

}
