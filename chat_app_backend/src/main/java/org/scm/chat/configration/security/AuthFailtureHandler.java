package org.scm.chat.configration.security;


import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.scm.chat.configration.jwtconfigration.payload.JwtResponse;
import org.scm.chat.user.constant.UserConstant;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class AuthFailtureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {
        if (exception instanceof DisabledException) {
            HttpSession session = request.getSession();
            //response.sendRedirect("http://localhost:3000/oauth2/callback?status=error&message=Login failed. Please try again.");
        } else {
            //response.sendRedirect("http://localhost:3000/oauth2/callback?status=error&message=Login failed. Please try again.");
//             request.getRequestDispatcher("/loginFail").forward(request, response);

           /* JwtResponse jwtResponse = JwtResponse.builder()
                    .jwtToken(token)
                    .userName(user.getEmail())
                    .userId(user.getId())
                    .statusCode(UserConstant.STATUS_201) // You can use UserConstant.STATUS_201 if you prefer
                    .statusMsg("Login Successful")
                    .build();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            // Write the JwtResponse object to the response
            response.getWriter().write(jwtResponse.toString());  // Convert JwtResponse to JSON format
            response.getWriter().flush();*/

        }
    }

}