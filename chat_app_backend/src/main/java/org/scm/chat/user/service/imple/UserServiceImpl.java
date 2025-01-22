package org.scm.chat.user.service.imple;

import org.scm.chat.exception.UserAlreadyExistsException;
import org.scm.chat.user.dto.UserDto;
import org.scm.chat.user.mapper.UserMapper;
import org.scm.chat.user.model.User;
import org.scm.chat.user.repository.UserRepository;
import org.scm.chat.user.service.UserService;
import org.scm.chat.user.utility.Providers;
import org.scm.chat.user.utility.Role;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    /**
     * Register a new user
     */
    @Override
    public boolean registerUser(UserDto userDto) {
        if (this.userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("User already registered with the given Email Id: " + userDto.getEmail());
        }
       try{
         User user = UserMapper.UserDtoToUser(userDto, new User());
         user.setId(UUID.randomUUID().toString());
         user.setProvider(Providers.SELF);
         user.setRole(Role.ROLE_USER);
         user.setActive(true);
         user.setPhoneVerified(true);
         user.setEmailVerified(true);
         user.setProfilePic("http://res.cloudinary.com/dnhniwrqh/image/upload/c_fill,h_500,w_500/9cfcf9d1-0438-4d81-988b-b49590dcc249");
         userRepository.save(user);
         return true;
       }catch(Exception e){
           e.printStackTrace();
           return false;
       }
    }
}
