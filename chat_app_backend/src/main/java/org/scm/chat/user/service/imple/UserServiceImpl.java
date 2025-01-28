package org.scm.chat.user.service.imple;

import org.scm.chat.exception.UserAlreadyExistsException;
import org.scm.chat.services.ImageService;
import org.scm.chat.user.dto.UserDto;
import org.scm.chat.user.mapper.UserMapper;
import org.scm.chat.user.model.User;
import org.scm.chat.user.repository.UserRepository;
import org.scm.chat.user.service.UserService;
import org.scm.chat.user.utility.Providers;
import org.scm.chat.user.utility.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ImageService imageService;

    /**
     * Register a new user
     */
    @Override
    public boolean registerUser(UserDto userDto) {
        if (this.userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("User already registered with the given Email Id: " + userDto.getEmail());
        }
        if (this.userRepository.findByPhoneNumber(userDto.getPhoneNumber()).isPresent()) {
            throw new UserAlreadyExistsException("User already registered with the given PhoneNumber: " + userDto.getPhoneNumber());
        }
       try{
         User user = UserMapper.UserDtoToUser(userDto, new User());
         user.setId(UUID.randomUUID().toString());
         user.setProvider(Providers.SELF);
         user.setRole(Role.ROLE_USER);
         user.setActive(true);
         user.setPhoneVerified(true);
         user.setEmailVerified(true);
         user.setPassword(passwordEncoder.encode(user.getPassword()));
         user.setProfilePic("http://res.cloudinary.com/dnhniwrqh/image/upload/c_fill,h_500,w_500/9cfcf9d1-0438-4d81-988b-b49590dcc249");
         userRepository.save(user);
         return true;
       }catch(Exception e){
           e.printStackTrace();
           return false;
       }
    }

    /**
     * Get user information by user id
     */

    @Override
    public UserDto getUserInfoById(String userId) {
         User user = this.userRepository.findById(userId).orElseThrow(
                () -> new UserAlreadyExistsException("User not found with the given Id: " + userId)
        );

        return UserMapper.userMapToUserDto(user, new UserDto());
    }

    @Override
    public boolean updateUser(UserDto userDto, MultipartFile userImage) {
        User user = this.userRepository.findById(userDto.getUserId()).orElseThrow(
                () -> new UserAlreadyExistsException("User not found with the given Id: " + userDto.getUserId())
        );
        try {
            UserMapper.UserDtoToUser(userDto, user);
            if(userImage != null && !userImage.isEmpty() && userImage.equals("null")){
                String filename = UUID.randomUUID().toString();
                String fileURL = imageService.uploadImage(userImage, filename);
                user.setProfilePic(fileURL);
                user.setCloudinaryImagePublicId(filename);
            }
            else {
                user.setProfilePic("http://res.cloudinary.com/dnhniwrqh/image/upload/c_fill,h_500,w_500/9cfcf9d1-0438-4d81-988b-b49590dcc249");
            }
            userRepository.save(user);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
