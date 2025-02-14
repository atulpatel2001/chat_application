package org.scm.chat.chat.service.imple;

import org.scm.chat.chat.dto.ChatDisplayDto;
import org.scm.chat.chat.dto.ChatParticipantDto;
import org.scm.chat.chat.dto.UserDto;
import org.scm.chat.chat.mapper.ChatRoomMapper;
import org.scm.chat.chat.model.ChatMessage;
import org.scm.chat.chat.model.ChatParticipant;
import org.scm.chat.chat.model.ChatRoom;
import org.scm.chat.chat.repository.ChatMessageRepository;
import org.scm.chat.chat.repository.ChatParticipantRepository;
import org.scm.chat.chat.repository.ChatRoomRepository;
import org.scm.chat.chat.service.ChatParticipantService;
import org.scm.chat.exception.CommonException;
import org.scm.chat.exception.ResourceNotFoundException;
import org.scm.chat.exception.UserAlreadyExistsException;
import org.scm.chat.user.model.User;
import org.scm.chat.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service
public class ChatParticipantServiceImple implements ChatParticipantService {



   @Autowired private ChatRoomRepository chatRoomRepository;
   @Autowired private UserRepository userRepository;
   @Autowired private ChatParticipantRepository chatParticipantRepository;

    @Override
    public ChatParticipantDto addChatParticipant(Long chatRoomId, String contactUserId, String userId, String email, String contactId) {
         ChatRoom chatRoom = this.chatRoomRepository.findById(chatRoomId).orElseThrow(
                () -> new ResourceNotFoundException("Chat Room", "Id", chatRoomId.toString())
        );
        final User user = this.userRepository.findById(contactUserId).orElseThrow(
                () -> new CommonException("That Contact is Not Register in PlateForm....")
        );

        if (chatRoom.getParticipants().stream().anyMatch(participant -> participant.getUser().getId().equals(user.getId()))) {
            throw new UserAlreadyExistsException("Contact is Already Added in Group");
        }

        final ChatParticipant build = ChatParticipant.builder()
                .chatRoom(chatRoom)
                .user(user)
                .isAdmin(false)
                .joinedAt(LocalDateTime.now())
                .build();

         ChatParticipant save = this.chatParticipantRepository.save(build);
         UserDto userDto = ChatRoomMapper.userToUserDto(save.getUser());
        return ChatParticipantDto.builder().id(save.getId()).isAdmin(save.isAdmin()).joinedAt(save.getJoinedAt().toString()).user(userDto).build();
    }
}
