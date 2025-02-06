package org.scm.chat.chat.controller;


import org.scm.chat.chat.dto.ChatMessageDto;
import org.scm.chat.chat.dto.KafkaMessageDto;
import org.scm.chat.chat.dto.UserChatContactData;
import org.scm.chat.chat.service.ChatMessageService;
import org.scm.chat.chat.service.MessageProducer;
import org.scm.chat.exception.ResourceNotFoundException;
import org.scm.chat.user.model.User;
import org.scm.chat.user.repository.UserRepository;
import org.scm.chat.util.Helper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping(value = "/chat/with", produces = {MediaType.APPLICATION_JSON_VALUE})
@CrossOrigin("*")
public class ChatController {

    @Autowired
    private  ChatMessageService chatMessageService;


    @GetMapping("/get-chats")
    public ResponseEntity<?> getChatsBetweenUser(@RequestParam("contactId") String contactId, Authentication authentication){

        try
        {
            String username = Helper.getEmailOfLoggedInUser(authentication);
            UserChatContactData chatParticipants = null;
          if(contactId.equalsIgnoreCase("no")){
              chatParticipants = this.chatMessageService.getChatParticipantsInSeparatePage(username);
          }else {
               chatParticipants = this.chatMessageService.getChatParticipants(Long.valueOf(contactId), username);
          }
            return ResponseEntity.status(HttpStatus.OK).body(chatParticipants);

        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/get-messages")
    public ResponseEntity<?> getMessageBetweenUser(@RequestParam("roomId") Long roomId, Authentication authentication){

        try
        {
            String username = Helper.getEmailOfLoggedInUser(authentication);

             List<ChatMessageDto> chatMessages = this.chatMessageService.getChatMessages(roomId, username);
            return ResponseEntity.status(HttpStatus.OK).body(chatMessages);

        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


}
