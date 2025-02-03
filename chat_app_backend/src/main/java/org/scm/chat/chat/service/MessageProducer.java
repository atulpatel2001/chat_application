package org.scm.chat.chat.service;

import org.scm.chat.chat.dto.KafkaMessageDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component

public class MessageProducer {


    @Autowired
    private KafkaTemplate<String, KafkaMessageDto> kafkaTemplate;

    public void sendMessage(String topic, KafkaMessageDto message) {
        kafkaTemplate.send(topic, message);
    }
}
