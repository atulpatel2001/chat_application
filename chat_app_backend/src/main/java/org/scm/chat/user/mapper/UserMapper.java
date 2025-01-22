package org.scm.chat.user.mapper;

import org.scm.chat.user.dto.UserDto;
import org.scm.chat.user.model.User;

public class UserMapper {


        public static UserDto userMapToUserDto(User user, UserDto  userDto){
            userDto.setName(user.getName());
            userDto.setEmail(user.getEmail());
            /*userDto.setAbout(user.get());*/
            userDto.setPassword(user.getPassword());
            userDto.setPhoneNumber(user.getPhoneNumber());
            return userDto;
        }

        public static User UserDtoToUser(UserDto userDto, User user){
            user.setName(userDto.getName());
            user.setEmail(userDto.getEmail());
           /* user.setAbout(userDto.getAbout());*/
            user.setPassword(userDto.getPassword());
            user.setPhoneNumber(userDto.getPhoneNumber());

            return user;
        }
}
