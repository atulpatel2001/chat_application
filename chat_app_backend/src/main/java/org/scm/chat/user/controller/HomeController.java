package org.scm.chat.user.controller;

import jakarta.validation.Valid;
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

@RestController
@RequestMapping(value = "/chat", produces = {MediaType.APPLICATION_JSON_VALUE})
@CrossOrigin("*")
public class HomeController {

    @Autowired
    private UserService userService;

    @PostMapping({"/register","/signup"})
    public ResponseEntity<?> createUser(@Valid @RequestBody UserDto userDto) {
        try {
            boolean isRegistered = this.userService.registerUser(userDto);

            if (isRegistered) {
                return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseDto(UserConstant.STATUS_201, UserConstant.MESSAGE_201));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDto(UserConstant.STATUS_400, UserConstant.MESSAGE_400));
            }
        }
        catch (UserAlreadyExistsException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
