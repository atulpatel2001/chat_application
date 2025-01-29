package org.scm.chat.contact.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SocialLinkDto {

    @Schema(hidden = true)
    private Long id;


    private String link;


    private String title;

}
