package org.scm.chat.user.mapper;

import org.scm.chat.user.dto.UserDto;
import org.scm.chat.user.model.User;
import org.scm.chat.user.utility.Providers;

public class UserMapper {


        public static UserDto userMapToUserDto(User user, UserDto  userDto){
            userDto.setName(user.getName());
            userDto.setEmail(user.getEmail());
            userDto.setPassword(user.getPassword());
            userDto.setPhoneNumber(user.getPhoneNumber());
            userDto.setProfilePic(user.getProfilePic());
            if (user.getProvider() != null) {
                userDto.setProvider(user.getProvider() != null ? user.getProvider() : Providers.SELF);
            }
            userDto.setUserId(user.getId());
            return userDto;
        }

        public static User UserDtoToUser(UserDto userDto, User user){
            user.setName(userDto.getName());
            user.setEmail(userDto.getEmail());
            user.setPassword(userDto.getPassword());
            user.setPhoneNumber(userDto.getPhoneNumber());
            user.setProfilePic(userDto.getProfilePic());
            user.setProvider(userDto.getProvider() != null ? userDto.getProvider() : Providers.SELF);
            user.setId(user.getId());
            return user;
        }
}
