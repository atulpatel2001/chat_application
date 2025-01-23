package org.scm.chat.util;

import org.scm.chat.configration.jwtconfigration.JwtHelper;
import org.scm.chat.configration.jwtconfigration.payload.JwtResponse;
import org.scm.chat.exception.CredentialInvalidException;
import org.scm.chat.exception.ResourceNotFoundException;
import org.scm.chat.user.constant.UserConstant;
import org.scm.chat.user.model.User;
import org.scm.chat.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtil {

   /* @Autowired
    private AuthenticationManager manager;
*/
    @Autowired
    private JwtHelper helper;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepo;

    /*private void doAuthenticate(String email, String password) {

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(email, password);
        try {
            manager.authenticate(authentication);

        } catch (BadCredentialsException e) {
            throw new CredentialInvalidException(e.getMessage());
        }

    }*/

    public String getJwtResponse(String email, String password) {
       /* this.doAuthenticate(email, password);*/
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String token = this.helper.generateToken(userDetails);
        User user_=userRepo.findByEmail(email).orElseThrow(
                () -> new ResourceNotFoundException("User", "Email Id", String.valueOf(email))
        );

        JwtResponse jwtResponse = JwtResponse.builder()
                .jwtToken(token)
                .userName(user_.getEmail())
                .userId(user_.getId())
                .statusCode(UserConstant.STATUS_201) // You can use UserConstant.STATUS_201 if you prefer
                .statusMsg("Login Successful")
                .build();

        return jwtResponse.toString();
    }
}
