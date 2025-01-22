package org.scm.chat.chat.model;

import jakarta.persistence.*;
import lombok.*;
import org.scm.chat.model.BaseEntity;
import org.scm.chat.chat.utility.ChatType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "chat_rooms")
public class ChatRoom extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "chat_type", nullable = false, length = 20) // Enum type, e.g., ONE_TO_ONE or GROUP
    private ChatType type;

    @Column(name = "room_name", length = 100)
    private String name;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;


}
