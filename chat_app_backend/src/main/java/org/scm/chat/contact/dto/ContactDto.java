package org.scm.chat.contact.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;


import java.util.ArrayList;
import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ContactDto {

//    @Schema(hidden = true)
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits long")
    @NotBlank(message = "PhoneNumber is required")
    private String phoneNumber;

    private String address;

    @Schema(hidden = true)
    private String picture;


    private String description;


    private boolean favorite = false;

    @Schema(hidden = true)
    private String cloudinaryImagePublicId;

    private String userId;


    private List<SocialLinkDto> links = new ArrayList<>();

    private String contactUser_Id;

}
