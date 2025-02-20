package org.scm.chat.chat.model;

import jakarta.persistence.*;
import lombok.*;
import org.scm.chat.model.BaseEntity;
import org.scm.chat.user.model.User;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "message_status")
public class MessagesStatus extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "message_id", nullable = false)
    private ChatMessage chatMessage;  // The message that was seen

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // The user who saw the message


    private LocalDateTime seenAt;  // When the user saw the message

    private String status;
}