package org.scm.chat.contact.services;

import org.scm.chat.contact.dto.ContactDto;
import org.springframework.web.multipart.MultipartFile;

public interface ContactService {


    public boolean createContact(ContactDto contactDto, MultipartFile contactImage);
}
