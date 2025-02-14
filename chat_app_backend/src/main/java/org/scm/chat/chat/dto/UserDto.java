package org.scm.chat.chat.dto;

import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
@ToString
public class UserDto {

    private String id;

    private String name;

    private String email;

    private String profilePic;

    private String phoneNumber;
}
