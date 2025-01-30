package org.scm.chat.contact.controller;


import jakarta.validation.Valid;
import org.scm.chat.contact.constant.ContactConstant;
import org.scm.chat.contact.dto.ContactDto;
import org.scm.chat.contact.services.ContactService;
import org.scm.chat.exception.UserAlreadyExistsException;
import org.scm.chat.exception.dto.ResponseDto;
import org.scm.chat.user.service.UserService;
import org.scm.chat.util.Helper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(value = "/chat/contact", produces = {MediaType.APPLICATION_JSON_VALUE})
@CrossOrigin("*")
public class ContactController {

    @Autowired
    private ContactService contactService;
    @Autowired
    private UserService userService;

    @PostMapping(value = "/add-contact")
    public ResponseEntity<?> addContact(@Valid @RequestPart("contactDto") ContactDto contactDto, @RequestPart("contact_image") MultipartFile contact_image){
        System.out.println(contactDto.toString());
        System.out.println(contact_image.getOriginalFilename());
        try {

            boolean contact = this.contactService.createContact(contactDto,contact_image);
            if (contact) {
                return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseDto(ContactConstant.STATUS_201, ContactConstant.MESSAGE_201));
            }else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDto(ContactConstant.STATUS_400, ContactConstant.MESSAGE_400));

            }
        }
        catch (UserAlreadyExistsException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping(value = "/get-contact")
    public ResponseEntity<?> getContacts(Authentication authentication){
        try {

            String username = Helper.getEmailOfLoggedInUser(authentication);
            System.out.println("Login User:-"+username);
            return ResponseEntity.status(HttpStatus.OK).body(this.contactService.getContact(username));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping(value = "/get-contact-by-id")
    public ResponseEntity<?> getContactsByContactId(@RequestParam("contactId") Long contactId,Authentication authentication){
        try {

            String username = Helper.getEmailOfLoggedInUser(authentication);
            System.out.println("Login User:-"+username);
            return ResponseEntity.status(HttpStatus.OK).body(this.contactService.getContactById(contactId));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @PostMapping(value = "/update-contact")
    public ResponseEntity<?> updateContact(@Valid @RequestPart("contactDto") ContactDto contactDto, @RequestPart("contact_image") MultipartFile contact_image,@RequestParam("id") Long id,Authentication authentication){
        System.out.println(contactDto.toString());
        System.out.println(contact_image.getOriginalFilename());
        try {
            String username = Helper.getEmailOfLoggedInUser(authentication);
            boolean contact = this.contactService.updateContact(contactDto,contact_image,id);
            if (contact) {
                return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseDto(ContactConstant.STATUS_201, ContactConstant.MESSAGE_201));
            }else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDto(ContactConstant.STATUS_400, ContactConstant.MESSAGE_400));

            }
        }
        catch (UserAlreadyExistsException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
 }
