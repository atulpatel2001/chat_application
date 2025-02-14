package org.scm.chat.chat.service;

import org.scm.chat.chat.dto.ChatParticipantDto;

public interface ChatParticipantService {


    ChatParticipantDto addChatParticipant(Long chatRoomId, String contactUserId, String userId, String email, String contactId);

}
