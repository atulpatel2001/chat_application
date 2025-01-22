package org.scm.chat.user.model;

import jakarta.persistence.*;
import lombok.*;
import org.scm.chat.model.BaseEntity;
import org.scm.chat.user.utility.Providers;
import org.scm.chat.user.utility.Role;


@Entity
@Table(name = "user_master", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")
})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User extends BaseEntity {

    @Id
    private String id;

    @Column(name = "user_name", nullable = false, length = 100) // Consistent naming convention
    private String name;

    @Column(name = "email", unique = true, nullable = false, length = 150)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password;


    @Column(name = "profile_picture", length = 1000) // Use descriptive column name
    private String profilePic;

    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "is_email_verified", nullable = false)
    private boolean emailVerified = false;

    @Column(name = "is_phone_verified", nullable = false)
    private boolean phoneVerified = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "auth_provider", nullable = false, length = 20) // For Providers enum
    private Providers provider = Providers.SELF;

    @Column(name = "provider_user_id", length = 100)
    private String providerUserId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;



}