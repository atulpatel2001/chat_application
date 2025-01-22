package org.scm.chat.user.constant;

import org.springframework.stereotype.Component;

@Component
public class UserConstant {

    public static final String  STATUS_201 = "201";
    public static final String  MESSAGE_201 = "User created successfully";

    public static final String STATUS_400 = "400";
    public static final String MESSAGE_400 = "User registration failed";
    public static final String STATUS_401 = "401";
    public static final String MESSAGE_401 = "User Credential Wrong!";
    public static final String  STATUS_200 = "200";
    public static final String  MESSAGE_200 = "Request processed successfully";
    public static final String  STATUS_417 = "417";
    public static final String  MESSAGE_417_UPDATE= "Update operation failed. Please try again or contact Dev team";
    public static final String  MESSAGE_417_DELETE= "Delete operation failed. Please try again or contact Dev team";
     public static final String  STATUS_500 = "500";
     public static final String  MESSAGE_500 = "An error occurred. Please try again or contact Developer team";
}
