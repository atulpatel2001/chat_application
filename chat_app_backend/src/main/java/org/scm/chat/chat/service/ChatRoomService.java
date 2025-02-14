package org.scm.chat.chat.service;

import org.scm.chat.chat.dto.ChatRoomDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ChatRoomService {



    ChatRoomDto createChatRoom(String loginUserId, String groupName, MultipartFile image);

    List<ChatRoomDto> getChatRooms(String loginUserId);


    boolean updateChatRoomDetail(Long chatRoomId, String groupName, MultipartFile image);
}
