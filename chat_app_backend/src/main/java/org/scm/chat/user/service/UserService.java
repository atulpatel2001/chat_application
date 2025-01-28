package org.scm.chat.user.service;

import org.scm.chat.user.dto.UserDto;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {

    boolean registerUser(UserDto userDto);

    UserDto getUserInfoById(String userId);


    boolean updateUser(UserDto userDto, MultipartFile userImage);

}
