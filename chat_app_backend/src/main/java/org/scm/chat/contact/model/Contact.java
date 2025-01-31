package org.scm.chat.contact.model;

import jakarta.persistence.*;
import lombok.*;
import org.scm.chat.model.BaseEntity;
import org.scm.chat.user.model.User;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@ToString
@Table(name = "contacts")
public class Contact extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "email", nullable = false, length = 150)
    private String email;

    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "picture", length = 1000)
    private String picture;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "is_favorite", nullable = false)
    private boolean favorite = false;

    @Column(name = "cloudinary_image_public_id", length = 255)
    private String cloudinaryImagePublicId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "contact", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<SocialLink> links = new ArrayList<>();

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contactUserId")
    private User contactUserId;
}
