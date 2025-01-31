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
@Table(name = "chat_messages")
public class ChatMessage extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id", nullable = false)
    private ChatRoom chatRoom;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User senderId;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiverId; // This can be null for group messages

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;


    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    private MessageStatus status = MessageStatus.SENT;

    public enum MessageStatus {
        SENT,
        DELIVERED,
        READ
    }



}


