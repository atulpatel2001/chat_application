package org.scm.chat.contact.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.validator.constraints.URL;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SocialLinkDto {

    @Schema(hidden = true)
    private Long id;

    @NotBlank(message = "Link cannot be blank")
    @URL(message = "Invalid URL format")
    private String link;

    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 100, message = "Title must be between 2 and 100 characters")
    private String title;

}
