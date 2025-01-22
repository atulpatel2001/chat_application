package org.scm.chat.exception.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor

public class ResponseDto {

    private String statusCode;


    private String statusMsg;
}
