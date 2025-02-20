package org.scm.chat.chat.service;

import com.nimbusds.jose.shaded.gson.JsonElement;
import com.nimbusds.jose.shaded.gson.JsonObject;
import com.nimbusds.jose.shaded.gson.JsonParser;
import org.scm.chat.chat.model.ChatMessage;
import org.scm.chat.chat.model.ChatRoom;
import org.scm.chat.chat.repository.ChatMessageRepository;
import org.scm.chat.chat.repository.ChatRoomRepository;
import org.scm.chat.exception.ResourceNotFoundException;
import org.scm.chat.user.model.User;
import org.scm.chat.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class MessageConsumer {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatRoomRepository  chatRoomRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @KafkaListener(topics = "single_chat_messages", groupId = "chat_app")
    public void listen(String message) {
        System.out.println("Received message: " + message);
        saveMessage(message);
    }

    @KafkaListener(topics = "group_chat_messages", groupId = "chat_app")
    public void listenForGroup(String message) {
        System.out.println("Received message: " + message);
        saveGroupMessage(message);
    }



private void  saveGroupMessage(String message){
    JsonObject jsonObject = JsonParser.parseString(message).getAsJsonObject();
    String sender = jsonObject.get("senderId").getAsString();
    String chatRoomId = jsonObject.get("chatRoomId").getAsString();
    String content = jsonObject.get("message").getAsString();
    String status = jsonObject.get("status").getAsString();
    JsonElement jsonElement = jsonObject.get("timestamp");
    String timestampStr = jsonElement.getAsString();

    // Convert String to LocalDateTime
    LocalDateTime dateTime = LocalDateTime.parse(timestampStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    final User senderUser = this.userRepository.findById(sender).orElseThrow(() -> new ResourceNotFoundException("User", "User Id", sender));
    final ChatRoom chatRoom = this.chatRoomRepository.findById(Long.valueOf(chatRoomId)).orElseThrow(() -> new ResourceNotFoundException("Chat Room", "Chat Room Id", chatRoomId));


    ChatMessage build = ChatMessage.builder().message(content)
            .senderId(senderUser)
            .chatRoom(chatRoom)
            .timestamp(dateTime)
            .status(status.equalsIgnoreCase("SENT")? ChatMessage.MessageStatus.SENT: ChatMessage.MessageStatus.DELIVERED)
            .build();
    ChatMessage save = chatMessageRepository.save(build);
    System.out.println(save.toString());

}
    private void saveMessage(String message) {
        JsonObject jsonObject = JsonParser.parseString(message).getAsJsonObject();
        String sender = jsonObject.get("senderId").getAsString();
        String chatRoomId = jsonObject.get("chatRoomId").getAsString();
        String content = jsonObject.get("message").getAsString();
        String receiverId = jsonObject.get("receiverId").getAsString();
        String status = jsonObject.get("status").getAsString();
        JsonElement jsonElement = jsonObject.get("timestamp");
        String timestampStr = jsonElement.getAsString();

        // Convert String to LocalDateTime
        LocalDateTime dateTime = LocalDateTime.parse(timestampStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        final User senderUser = this.userRepository.findById(sender).orElseThrow(() -> new ResourceNotFoundException("User", "User Id", sender));
        final User receiverUser = this.userRepository.findById(receiverId).orElseThrow(() -> new ResourceNotFoundException("User", "User Id", receiverId));
        final ChatRoom chatRoom = this.chatRoomRepository.findById(Long.valueOf(chatRoomId)).orElseThrow(() -> new ResourceNotFoundException("Chat Room", "Chat Room Id", chatRoomId));


         ChatMessage build = ChatMessage.builder().message(content)
                .receiverId(receiverUser)
                .senderId(senderUser)
                .chatRoom(chatRoom)
                .timestamp(dateTime)
                 .status(status.equalsIgnoreCase("SENT")? ChatMessage.MessageStatus.SENT: ChatMessage.MessageStatus.DELIVERED)
                .build();
         ChatMessage save = chatMessageRepository.save(build);
        System.out.println(save.toString());
    }

}
