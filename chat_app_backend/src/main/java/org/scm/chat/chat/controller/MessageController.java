package org.scm.chat.chat.controller;


import org.scm.chat.chat.dto.*;
import org.scm.chat.chat.model.ChatMessage;
import org.scm.chat.chat.repository.ChatMessageRepository;
import org.scm.chat.chat.service.ChatMessageService;
import org.scm.chat.chat.service.MessageProducer;
import org.scm.chat.exception.ResourceNotFoundException;
import org.scm.chat.user.model.User;
import org.scm.chat.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
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
    private UserRepository userRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ChatMessageService chatMessageService;


    @MessageMapping("/chat.sendMessage")
//    @SendTo("/topic/public")
    public void sendMessage(@RequestBody KafkaMessageDto message) {
        message.setTimestamp(LocalDateTime.now().toString());
        messagingTemplate.convertAndSend("/topic/public/" + message.getChatRoomId(), message);
        messageProducer.sendMessage(topic, message);
    }


    @MessageMapping("/chat.sendTyping")
//    @SendTo("/topic/public/typing")
    public void typing(@Payload TypingMessage typingMessage) {

        User user = this.userRepository.findById(typingMessage.getUserId()).orElseThrow(() ->
                new ResourceNotFoundException("User", "user Id", typingMessage.getUserId()));
        System.out.println("Typing message: " + typingMessage);
        messagingTemplate.convertAndSend("/topic/public/typing/" + typingMessage.getChatRoomId(),
                new TypingNotification(typingMessage.getUserId(), typingMessage.getChatRoomId(), user.getName(), typingMessage.isTyping()));
    }


    @MessageMapping("/chat.updateStatus")
    //@SendTo("/topic/message-status")
    public void updateMessageStatus(@Payload ChatStatusUpdateDto messageDto) {
        try {
            chatMessageRepository.updateMessageStatus(messageDto.getChatRoomId(), messageDto.getUserId(), messageDto.getStatus().equalsIgnoreCase("READ")? ChatMessage.MessageStatus.READ: ChatMessage.MessageStatus.DELIVERED);

            messagingTemplate.convertAndSend("/topic/public/status/update/" + messageDto.getChatRoomId(),
                    messageDto);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @MessageMapping("/chat.updateStatus.Read")
    public void updateMessageStatusTORead(@Payload ChatStatusUpdateDto messageDto) {
        try {
            chatMessageRepository.updateMessageStatusToRead(messageDto.getChatRoomId(), messageDto.getUserId());
            messagingTemplate.convertAndSend("/topic/public/status/update/sent/" + messageDto.getChatRoomId(),
                    messageDto);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }



    @MessageMapping("/chat.sendMessage_g")
//    @SendTo("/topic/public")
    public void sendGroupMessage(@RequestBody KafkaMessageDto message) {
        message.setTimestamp(LocalDateTime.now().toString());
        messagingTemplate.convertAndSend("/topic/public/group/" + message.getChatRoomId(), message);
        messageProducer.sendMessage(topic, message);
    }
}
