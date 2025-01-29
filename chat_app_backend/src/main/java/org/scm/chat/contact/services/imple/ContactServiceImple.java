package org.scm.chat.contact.services.imple;

import org.scm.chat.contact.dto.ContactDto;
import org.scm.chat.contact.dto.SocialLinkDto;
import org.scm.chat.contact.mapper.ContactMapper;
import org.scm.chat.contact.model.Contact;
import org.scm.chat.contact.model.SocialLink;
import org.scm.chat.contact.repository.ContactRepository;
import org.scm.chat.contact.repository.SocialLinkRepository;
import org.scm.chat.contact.services.ContactService;
import org.scm.chat.exception.ResourceNotFoundException;
import org.scm.chat.exception.UserAlreadyExistsException;
import org.scm.chat.services.ImageService;
import org.scm.chat.user.model.User;
import org.scm.chat.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ContactServiceImple implements ContactService {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private  ContactMapper contactMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SocialLinkRepository socialLinkRepository;

    @Autowired
    private ImageService imageService;


    @Override
    public boolean createContact(ContactDto contactDto, MultipartFile contactImage) {
         if (this.contactRepository.findByEmail(contactDto.getEmail()).isPresent()){
             throw new UserAlreadyExistsException("Contact already Added with the given Email Id: " + contactDto.getEmail());
         }
         if (this.contactRepository.findByPhoneNumber(contactDto.getPhoneNumber()).isPresent()){
             throw new UserAlreadyExistsException("Contact already Added with the given PhoneNumber: " + contactDto.getPhoneNumber());
         }

         try {
             User user = this.userRepository.findById(contactDto.getUserId()).orElseThrow(
                     ()-> new ResourceNotFoundException("User", "User Id", contactDto.getUserId())
             );
             List<SocialLink> socialLinks=new ArrayList<>();
             if(contactDto.getLinks() != null){
                 List<SocialLinkDto> links = contactDto.getLinks();
                 socialLinks=this.contactMapper.mapSocialLinksDtoToEntity(links);
             }
             Contact contact = this.contactMapper.toEntity(contactDto);
//             String contactId = UUID.randomUUID().toString();
//             contact.setId(contactId);
             contact.setUser(user);

             if (!contactImage.isEmpty()){
                 String filename = UUID.randomUUID().toString();
                 String fileURL = imageService.uploadImage(contactImage, filename);
                 contact.setPicture(fileURL);
                 contact.setCloudinaryImagePublicId(filename);
             }else {
                 contact.setPicture("http://res.cloudinary.com/dnhniwrqh/image/upload/c_fill,h_500,w_500/9cfcf9d1-0438-4d81-988b-b49590dcc249");
             }
             contact.setLinks(null);
             Contact save = this.contactRepository.save(contact);
             socialLinks.forEach(socialLink -> {
                 socialLink.setContact(save); // Now, contact has an ID
             });

             this.socialLinkRepository.saveAll(socialLinks);
             System.out.println(contact);

           return  true;
         }catch (Exception e){
             e.printStackTrace();
             return false;
         }
    }
}
