package org.scm.chat.contact.mapper;

import org.mapstruct.*;
import org.scm.chat.contact.dto.ContactDto;
import org.scm.chat.contact.model.Contact;
import org.scm.chat.contact.dto.SocialLinkDto;
import org.scm.chat.contact.model.SocialLink;

import java.util.List;

@Mapper(componentModel = "spring") // Enables Spring Dependency Injection
public interface ContactMapper {

    // Convert DTO to Entity
    Contact toEntity(ContactDto contactDto);

    // Convert Entity to DTO
    ContactDto toDto(Contact contact);

    List<ContactDto> mapEntitiesToDtos(List<Contact> entities);

    List<Contact> mapDtosToEntities(List<ContactDto> dtos);

    // Handle SocialLinks mapping
    List<SocialLink> mapSocialLinksDtoToEntity(List<SocialLinkDto> dtos);

    List<SocialLinkDto> mapSocialLinksEntityToDto(List<SocialLink> entities);
}