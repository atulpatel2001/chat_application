package org.scm.chat.configration.jwtconfigration.payload;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class JwtResponse {
    private String jwtToken;
    private  String userName;
    private  String userId;
    private String statusCode;
    private String statusMsg;
}
