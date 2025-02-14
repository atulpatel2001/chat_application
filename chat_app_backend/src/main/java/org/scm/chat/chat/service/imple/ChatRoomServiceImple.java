package org.scm.chat.chat.service.imple;

import org.scm.chat.chat.dto.ChatRoomDto;
import org.scm.chat.chat.mapper.ChatRoomMapper;
import org.scm.chat.chat.model.ChatParticipant;
import org.scm.chat.chat.model.ChatRoom;
import org.scm.chat.chat.repository.ChatParticipantRepository;
import org.scm.chat.chat.repository.ChatRoomRepository;
import org.scm.chat.chat.service.ChatRoomService;
import org.scm.chat.chat.utility.ChatType;
import org.scm.chat.exception.ResourceNotFoundException;
import org.scm.chat.services.ImageService;
import org.scm.chat.user.model.User;
import org.scm.chat.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ChatRoomServiceImple implements ChatRoomService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ImageService imageService;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private ChatParticipantRepository chatParticipantRepository;


    @Override
    public ChatRoomDto createChatRoom(String loginUserId, String groupName, MultipartFile image) {
        final User user = this.userRepository.findByEmail(loginUserId).orElseThrow(() -> new ResourceNotFoundException("User", "Email", loginUserId));

        try {
            String fileURL = "";
            if (!image.isEmpty()) {
                String filename = UUID.randomUUID().toString();
                fileURL = imageService.uploadImage(image, filename);
            }
            ChatRoom chatRoom = ChatRoom.builder().type(ChatType.GROUP).name(groupName).groupImage(fileURL).build();
            System.out.println(chatRoom.toString());
            ChatRoom save = this.chatRoomRepository.save(chatRoom);
            final ChatParticipant build = ChatParticipant.builder().user(user).joinedAt(LocalDateTime.now()).isAdmin(true).chatRoom(save).build();

            ChatParticipant chatParticipant = chatParticipantRepository.save(build);

            return ChatRoomMapper.chatRoomAndParticipantMapToChatRoomDto(save, chatParticipant);

        } catch (Exception e) {
            e.printStackTrace();

            return (ChatRoomDto) List.of();
        }

    }

    @Override
    public List<ChatRoomDto> getChatRooms(String loginUserId) {
        final User user = this.userRepository.findByEmail(loginUserId).orElseThrow(() -> new ResourceNotFoundException("User", "Email", loginUserId));
          try {
              List<ChatRoom> chatRoomsWithParticipantsByUserId = this.chatRoomRepository.findChatRoomsByUserId(user.getId());
              if(chatRoomsWithParticipantsByUserId.isEmpty()){
                  return List.of();
              }else {
                  return  ChatRoomMapper.listOFChatParticipantAndListOfChatRoomToChatRoomDto(chatRoomsWithParticipantsByUserId);
              }
          }catch (Exception e){
              e.printStackTrace();
          }
        return List.of();
    }

    @Override
    public boolean updateChatRoomDetail(Long chatRoomId, String groupName, MultipartFile image) {
         ChatRoom chatRoom = this.chatRoomRepository.findById(chatRoomId).orElseThrow(() -> new ResourceNotFoundException("ChatRoom", "Id", chatRoomId.toString()));
         boolean isUpdated = false;
         try{
             chatRoom.setName(groupName);
             if (image != null && !image.isEmpty()) {
                 String filename = UUID.randomUUID().toString();
                 String fileURL = imageService.uploadImage(image, filename);
                 chatRoom.setGroupImage(fileURL);
             }

             chatRoomRepository.save(chatRoom);
                isUpdated = true;
         }catch (Exception e){
             e.printStackTrace();
         }

         return isUpdated;
    }


}
