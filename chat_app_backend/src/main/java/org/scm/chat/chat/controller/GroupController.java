package org.scm.chat.chat.controller;

import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.scm.chat.chat.dto.KafkaMessageDto;
import org.scm.chat.chat.service.ChatMessageService;
import org.scm.chat.chat.service.ChatParticipantService;
import org.scm.chat.chat.service.ChatRoomService;
import org.scm.chat.contact.constant.ContactConstant;
import org.scm.chat.contact.dto.ContactDto;
import org.scm.chat.exception.UserAlreadyExistsException;
import org.scm.chat.exception.dto.ResponseDto;
import org.scm.chat.util.Helper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@RestController
@RequestMapping(value = "/chat/group", produces = {MediaType.APPLICATION_JSON_VALUE})
@CrossOrigin("*")
public class GroupController {


    @Autowired private ChatRoomService chatRoomService;

    @Autowired private ChatParticipantService chatParticipantService;

    @Autowired private ChatMessageService chatMessageService;

    @PostMapping(value = "/create")
    public ResponseEntity<?> addContact(@RequestParam("name") String name, @RequestPart("image") MultipartFile image, Authentication authentication){
        try {

            String username = Helper.getEmailOfLoggedInUser(authentication);
            System.out.println("Image name"+image.getOriginalFilename());
            System.out.println("GroupName:-"+name);
            System.out.println("username:-"+username);

               return ResponseEntity.status(HttpStatus.CREATED).body(chatRoomService.createChatRoom(username,name,image));
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @GetMapping(value = "/get-rooms")
    public ResponseEntity<?> getRooms(Authentication authentication){
        try {
            String username = Helper.getEmailOfLoggedInUser(authentication);
            return ResponseEntity.status(HttpStatus.OK).body(chatRoomService.getChatRooms(username));
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @PutMapping(value = "/update-room")
    public ResponseEntity<?> updateChatRoom(
            @RequestParam Long id,
            @RequestParam String name,
            @RequestParam(required = false) MultipartFile groupImage) {

        try {
            boolean b = chatRoomService.updateChatRoomDetail(id, name, groupImage);
            if (b) {
                return ResponseEntity.status(HttpStatus.OK).body(new ResponseDto(HttpStatus.OK.toString(),"Chat Room Updated Successfully!!!"));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDto(HttpStatus.BAD_REQUEST.toString(),"Chat Room Not Updated Try After Some Time!!!👍"));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping(value = "/add-participant")
    public ResponseEntity<?> addParticipant(@RequestParam Long groupId,
                                            @RequestParam String email,
                                            @RequestParam String id,
                                            @RequestParam String contactUserId,
                                            @RequestParam String userId){
        try {
            System.out.println("Group Id:-"+groupId);
            System.out.println("Email:-"+email);
            System.out.println("Id:-"+id);
            System.out.println("ContactUserId:-"+contactUserId);
            System.out.println("UserId:-"+userId);
         return ResponseEntity.status(HttpStatus.CREATED).body(this.chatParticipantService.addChatParticipant(groupId, contactUserId, userId, email, id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/get-messages")
    public ResponseEntity<?> getMessage(@RequestParam Long groupId,Authentication authentication){
        try {
            String username = Helper.getEmailOfLoggedInUser(authentication);
            return ResponseEntity.status(HttpStatus.OK).body(this.chatMessageService.getChatsForGroup(groupId,username));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
