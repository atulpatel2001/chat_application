package org.scm.chat.configration.security;


import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.scm.chat.configration.jwtconfigration.JwtHelper;
import org.scm.chat.configration.jwtconfigration.payload.JwtResponse;
import org.scm.chat.exception.CredentialInvalidException;
import org.scm.chat.exception.ResourceNotFoundException;
import org.scm.chat.user.constant.UserConstant;
import org.scm.chat.user.model.User;
import org.scm.chat.user.repository.UserRepository;
import org.scm.chat.user.utility.Providers;
import org.scm.chat.user.utility.Role;
import org.scm.chat.util.SecurityUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
public class OAuthAuthenicationSuccessHandler implements AuthenticationSuccessHandler {



    Logger logger = LoggerFactory.getLogger(OAuthAuthenicationSuccessHandler.class);

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private SecurityUtil securityUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        logger.info("OAuthAuthenticationSuccessHandler");

        OAuth2AuthenticationToken oauth2AuthenicationToken = (OAuth2AuthenticationToken) authentication;
        String authorizedClientRegistrationId = oauth2AuthenicationToken.getAuthorizedClientRegistrationId();
        logger.info("Authorized Client: " + authorizedClientRegistrationId);

        DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();
        //  oauthUser.getAttributes().forEach((key, value) -> logger.info(key + " : " + value));

        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setRole(Role.ROLE_USER);
        user.setEmailVerified(true);
        user.setActive(true);
        user.setActive(true);
        user.setPhoneVerified(true);
        user.setEmailVerified(true);
        user.setPassword("password");

        if (authorizedClientRegistrationId.equalsIgnoreCase("google")) {
            user.setEmail(oauthUser.getAttribute("email").toString());
            user.setProfilePic(oauthUser.getAttribute("picture").toString());
            user.setName(oauthUser.getAttribute("name").toString());
            user.setProviderUserId(oauthUser.getName());
            user.setProvider(Providers.GOOGLE);
        } else if (authorizedClientRegistrationId.equalsIgnoreCase("github")) {
            String email = oauthUser.getAttribute("email") != null ? oauthUser.getAttribute("email").toString()
                    : oauthUser.getAttribute("login").toString() + "@gmail.com";
            String picture = oauthUser.getAttribute("avatar_url").toString();
            String name = oauthUser.getAttribute("login").toString();
            user.setEmail(email);
            user.setProfilePic(picture);
            user.setName(name);
            user.setProviderUserId(oauthUser.getName());
            user.setProvider(Providers.GITHUB);
        } else {
            logger.info("OAuthAuthenticationSuccessHandler: Unknown provider");
        }

        User existingUser = userRepo.findByEmail(user.getEmail()).orElse(null);
        if (existingUser == null) {
            userRepo.save(user);
            logger.info("User saved: " + user.getEmail());
        } else {
            logger.info("Existing user found: " + existingUser.getEmail() + ", Roles: " + existingUser.getRole());
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);


        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Write the JwtResponse object to the response
        response.getWriter().write(securityUtil.getJwtResponse(user.getEmail(),"password"));
        response.getWriter().flush();
        //response.sendRedirect("http://localhost:3000/oauth2/callback?status=success&message=Login successful");
    }




}
