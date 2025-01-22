package org.scm.chat;

import io.swagger.v3.oas.annotations.ExternalDocumentation;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditAwareImpl")
@OpenAPIDefinition(
        info = @Info(
                title = "User microservice REST API Documentation",
                description = " User microservice REST API Documentation",
                version = "v1",
                contact = @Contact(
                        name = "Atul Patel",
                        email = "atul2001@gamail.com",
                        url = "https://www.atulpatel.com"
                ),
                license = @License(
                        name = "Apache 2.0",
                        url = "hello"
                )
        ),
        externalDocs = @ExternalDocumentation(
                description =  "User microservice REST API Documentation",
                url = "Hello"
        )
)

public class ChatAppBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChatAppBackendApplication.class, args);
    }

}
