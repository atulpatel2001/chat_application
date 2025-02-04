package org.scm.chat.chat.kafka.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class KafkaConfig {

    @Value("${chat.kafka.url}")
    private String kafkaServer;

    @Bean
    public NewTopic chatTopic() {
        return new NewTopic("single_chat_messages", 3, (short) 1);
    }






}
