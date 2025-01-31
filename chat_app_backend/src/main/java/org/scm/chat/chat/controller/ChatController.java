package org.scm.chat.chat.controller;


import org.scm.chat.chat.dto.UserChatContactData;
import org.scm.chat.chat.service.ChatMessageService;
import org.scm.chat.util.Helper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/chat/with", produces = {MediaType.APPLICATION_JSON_VALUE})
@CrossOrigin("*")
public class ChatController {

    @Autowired
    private  ChatMessageService chatMessageService;

    @GetMapping("/get-chats")
    public ResponseEntity<?> getChatsBetweenUser(@RequestParam("contactId") Long contactId, Authentication authentication){

        try
        {
            String username = Helper.getEmailOfLoggedInUser(authentication);

             UserChatContactData chatParticipants = this.chatMessageService.getChatParticipants(contactId,username);
            return ResponseEntity.status(HttpStatus.OK).body(chatParticipants);

        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
