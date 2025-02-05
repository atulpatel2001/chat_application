package org.scm.chat.user.controller;

import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.scm.chat.configration.jwtconfigration.JwtHelper;
import org.scm.chat.configration.jwtconfigration.payload.JwtRequest;
import org.scm.chat.configration.jwtconfigration.payload.JwtResponse;
import org.scm.chat.exception.CredentialInvalidException;
import org.scm.chat.exception.ResourceNotFoundException;
import org.scm.chat.exception.UserAlreadyExistsException;
import org.scm.chat.exception.dto.ResponseDto;
import org.scm.chat.user.constant.UserConstant;
import org.scm.chat.user.dto.UserDto;
import org.scm.chat.user.model.User;
import org.scm.chat.user.repository.UserRepository;
import org.scm.chat.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping(value = "/chat", produces = {MediaType.APPLICATION_JSON_VALUE})
@CrossOrigin("*")
public class HomeController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;


    @Autowired
    private JwtHelper helper;

    @Autowired
    private UserDetailsService userDetailsService;


    private final Logger logger = LoggerFactory.getLogger(HomeController.class);
    /**
     * This method is used to register a new user
     */
    @PostMapping({"/register","/signup"})
    public ResponseEntity<?> createUser(@Valid @RequestBody UserDto userDto) {
        try {
            boolean isRegistered = this.userService.registerUser(null);

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

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody JwtRequest request) {

        this.doAuthenticate(request.getEmail(), request.getPassword());


        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = this.helper.generateToken(userDetails);
        User user=userRepository.findByEmail(request.getEmail()).orElseThrow(
                () -> new ResourceNotFoundException("User", "Email Id", String.valueOf(request.getEmail()))
        );
        JwtResponse response = JwtResponse.builder()
                .jwtToken(token)
                .userName(userDetails.getUsername())
                .userId(user.getId())
                .statusCode(UserConstant.STATUS_201).statusMsg("Login Successful").build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    private void doAuthenticate(String email, String password) {

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(email, password);
        try {
            manager.authenticate(authentication);

        } catch (BadCredentialsException e) {
            throw new CredentialInvalidException(e.getMessage());
        }

    }




}
