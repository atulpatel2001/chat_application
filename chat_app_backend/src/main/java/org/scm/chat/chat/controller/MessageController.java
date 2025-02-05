package org.scm.chat.chat.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import org.scm.chat.chat.dto.KafkaMessageDto;
import org.scm.chat.chat.dto.TypingMessage;
import org.scm.chat.chat.dto.TypingNotification;
import org.scm.chat.chat.service.MessageProducer;
import org.scm.chat.exception.ResourceNotFoundException;
import org.scm.chat.user.model.User;
import org.scm.chat.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;


@RestController
@RequestMapping(produces = {MediaType.APPLICATION_JSON_VALUE})
@CrossOrigin("*")
public class MessageController {

    @Value("${chat.kafka.single}")
    private String topic;
    @Autowired
    private MessageProducer messageProducer;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserRepository  userRepository;




    @MessageMapping("/chat.sendMessage")
//    @SendTo("/topic/public")
    public void sendMessage(@RequestBody KafkaMessageDto message){
        message.setTimestamp(LocalDateTime.now().toString());
        messagingTemplate.convertAndSend("/topic/public/"+message.getChatRoomId(), message);
        messageProducer.sendMessage(topic, message);
    }


    @MessageMapping("/chat.sendTyping")
//    @SendTo("/topic/public/typing")
    public void typing(@Payload TypingMessage typingMessage) {

         User user = this.userRepository.findById(typingMessage.getUserId()).orElseThrow(() ->
                new ResourceNotFoundException("User", "user Id", typingMessage.getUserId()));
        System.out.println("Typing message: " + typingMessage.toString());
        messagingTemplate.convertAndSend("/topic/public/typing/" + typingMessage.getChatRoomId(),
                new TypingNotification(typingMessage.getUserId(), typingMessage.getChatRoomId(),user.getName(),typingMessage.isTyping()));
    }
}
