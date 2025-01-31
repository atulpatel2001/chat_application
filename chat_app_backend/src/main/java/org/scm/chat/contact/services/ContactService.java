package org.scm.chat.contact.services;

import org.scm.chat.contact.dto.ContactDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ContactService {


    public boolean createContact(ContactDto contactDto, MultipartFile contactImage);

    List<ContactDto> getContact(String userName);

    ContactDto getContactById(Long id);

    public boolean updateContact(ContactDto contactDto, MultipartFile contactImage,Long id);

    boolean deleteContact(Long id);

    boolean isUserExistsForChat(Long id,String userName);
}
