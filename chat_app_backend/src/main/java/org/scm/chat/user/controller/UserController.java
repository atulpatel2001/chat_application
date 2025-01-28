package org.scm.chat.user.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.scm.chat.exception.ResourceNotFoundException;
import org.scm.chat.exception.UserAlreadyExistsException;
import org.scm.chat.exception.dto.ResponseDto;
import org.scm.chat.user.constant.UserConstant;
import org.scm.chat.user.dto.UserDto;
import org.scm.chat.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(value = "/chat/user", produces = {MediaType.APPLICATION_JSON_VALUE})
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/info")
   private UserDto  getUserInfoById(@RequestParam @NotBlank(message = "User Id Must Be Require!!") String userId) {
         return this.userService.getUserInfoById(userId);
   }

   @PostMapping("/update_user")
   private ResponseEntity<?> updateUser(@Valid @RequestBody UserDto userDto,@RequestParam("userImage") MultipartFile userImage) {
       try {

           System.out.println(userDto.getPhoneNumber()+" "+userDto.getName());
           boolean b = this.userService.updateUser(userDto,userImage);
           if (b) {
               return ResponseEntity.status(HttpStatus.OK).body(new ResponseDto(UserConstant.STATUS_201, UserConstant.MESSAGE_201));
           } else {
               return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDto(UserConstant.STATUS_400, UserConstant.MESSAGE_400));
           }
       } catch (ResourceNotFoundException e){
           return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
       }
   }
}
