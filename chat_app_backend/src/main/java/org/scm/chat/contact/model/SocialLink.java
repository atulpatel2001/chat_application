package org.scm.chat.contact.model;

import jakarta.persistence.*;
import lombok.*;
import org.scm.chat.model.BaseEntity;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class SocialLink extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "link", nullable = false, length = 1000)
    private String link;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @ManyToOne
    @JoinColumn(name = "contact_id", nullable = false)
    private Contact contact;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;

}



