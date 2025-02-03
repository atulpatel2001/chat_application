package org.scm.chat.chat.service;

import com.nimbusds.jose.shaded.gson.JsonElement;
import com.nimbusds.jose.shaded.gson.JsonObject;
import com.nimbusds.jose.shaded.gson.JsonParser;
import org.scm.chat.chat.model.ChatMessage;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class MessageConsumer {

    @KafkaListener(topics = "single_chat_messages", groupId = "chat_app")
    public void listen(String message) {
        System.out.println("Received message: " + message);
        saveMessage(message, "single");
    }




    private void saveMessage(String message, String chatType) {
        // Parse the message (assuming it's in JSON format)
        // Example: {"sender": "user1", "content": "Hello", "chatId": "123"}
        JsonObject jsonObject = JsonParser.parseString(message).getAsJsonObject();
        String sender = jsonObject.get("senderId").getAsString();
        String chatRoomId = jsonObject.get("chatRoomId").getAsString();
        String content = jsonObject.get("message").getAsString();
        String receiverId = jsonObject.get("receiverId").getAsString();
        String status = jsonObject.get("status").getAsString();
        JsonElement jsonElement = JsonParser.parseString( jsonObject.get("timestamp").getAsString()).getAsJsonObject().get("timestamp");
        String timestampStr = jsonElement.getAsString();

        // Convert String to LocalDateTime
        LocalDateTime dateTime = LocalDateTime.parse(timestampStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        System.out.println("Parsed LocalDateTime: " + dateTime);
        System.out.println(sender);
        System.out.println(chatRoomId);
        System.out.println(content);
        System.out.println(receiverId);
        System.out.println(status);
        // Create and save the chat message
//        ChatMessage chatMessage = new ChatMessage();
//        chatMessage.setSender(sender);
//        chatMessage.setContent(content);
//        chatMessage.setChatType(chatType);
//        chatMessage.setChatId(chatId);
//        chatMessage.setTimestamp(LocalDateTime.now());
//        chatMessageRepository.save(chatMessage);
    }

}
