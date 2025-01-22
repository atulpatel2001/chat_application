package org.scm.chat.user.service;

import org.scm.chat.user.dto.UserDto;

public interface UserService {

    boolean registerUser(UserDto userDto);
}
