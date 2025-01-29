package org.scm.chat.contact.controller;


import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import org.scm.chat.contact.dto.ContactDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(value = "/chat/contact", produces = {MediaType.APPLICATION_JSON_VALUE})
@CrossOrigin("*")
public class ContactController {



    @PostMapping(value = "/add-contact")
    public ResponseEntity<?> addContact(@Valid @RequestPart("contactDto") ContactDto contactDto, @RequestPart("contact_image") MultipartFile contact_image){
        System.out.println(contactDto.toString());
        System.out.println(contact_image.getOriginalFilename());
        contactDto.getLinks().forEach(link -> System.out.println("Link: " + link.getLink() + ", Title: " + link.getTitle()));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ok");
    }
 }
