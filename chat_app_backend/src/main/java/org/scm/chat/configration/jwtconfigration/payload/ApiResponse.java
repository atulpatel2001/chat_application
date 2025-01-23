package org.scm.chat.configration.jwtconfigration.payload;

import lombok.*;

@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@Builder
public class ApiResponse {


    private String message;

    private boolean success;
}
