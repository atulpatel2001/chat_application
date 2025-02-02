package org.scm.chat.chat.service.imple;

import org.scm.chat.chat.dto.ChatDisplayDto;
import org.scm.chat.chat.dto.UserChatContactData;
import org.scm.chat.chat.model.ChatMessage;
import org.scm.chat.chat.repository.ChatMessageRepository;
import org.scm.chat.chat.service.ChatMessageService;
import org.scm.chat.contact.model.Contact;
import org.scm.chat.contact.repository.ContactRepository;
import org.scm.chat.exception.ResourceNotFoundException;
import org.scm.chat.user.model.User;
import org.scm.chat.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ChatMessageServiceImple implements ChatMessageService {


    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ContactRepository contactRepository;


    @Autowired
    private UserRepository userRepository;


    @Override
    public UserChatContactData getChatParticipants(Long id, String loggedInUserId) {

        Contact contact = this.contactRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Contact", "Id", id.toString())
        );
        UserChatContactData userChatContactData=new UserChatContactData();
        try{
            Optional<User> chatWithUser = this.userRepository.findByEmail(contact.getEmail());
            Optional<User> loginUser = this.userRepository.findByEmail(loggedInUserId);
            List<Object[]> result = this.chatMessageRepository.getSingleUserLastMessageDataForDisplay(loginUser.get().getId(),chatWithUser.get().getId());
            List<Object[]> latestMessagesForLoggedInUser = this.chatMessageRepository.findLatestMessagesForLoggedInUser(loginUser.get().getId());

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a");

            if(!result.isEmpty()){
                Object[] chatsBetweenUsersDesc = result.get(0);
                 ChatDisplayDto chatDisplayDto = new ChatDisplayDto();
                chatDisplayDto.setUserId(chatsBetweenUsersDesc[0].toString());
                 chatDisplayDto.setRoomId((Long) chatsBetweenUsersDesc[1]);
                 chatDisplayDto.setName(chatsBetweenUsersDesc[2].toString());
                chatDisplayDto.setEmail(chatsBetweenUsersDesc[3].toString());
                chatDisplayDto.setProfilePic(chatsBetweenUsersDesc[4].toString());
                chatDisplayDto.setLastMessage(chatsBetweenUsersDesc[5].toString());
                String formattedDate;
                if (chatsBetweenUsersDesc[6] instanceof Timestamp) {
                    formattedDate = ((Timestamp) chatsBetweenUsersDesc[6]).toLocalDateTime().format(formatter);
                } else if (chatsBetweenUsersDesc[6] instanceof LocalDateTime) {
                    formattedDate = ((LocalDateTime) chatsBetweenUsersDesc[6]).format(formatter);
                } else {
                    formattedDate = chatsBetweenUsersDesc[6] != null ? chatsBetweenUsersDesc[6].toString() : "";
                }
          chatDisplayDto.setLastMessageTime(formattedDate);
                userChatContactData.setSingleEmployee(chatDisplayDto);
            }
            else {
                userChatContactData.setSingleEmployee(null);
            }
            List<ChatDisplayDto> list=new ArrayList<>();
            if (!latestMessagesForLoggedInUser.isEmpty()){

                for (Object[] data:latestMessagesForLoggedInUser){
                    ChatDisplayDto chatDisplayDto = new ChatDisplayDto();
                    chatDisplayDto.setRoomId((Long) data[1]);
                    chatDisplayDto.setUserId(data[0].toString());
                    chatDisplayDto.setName(data[2].toString());
                    chatDisplayDto.setEmail(data[3].toString());
                    chatDisplayDto.setProfilePic(data[4].toString());

                    chatDisplayDto.setLastMessage(data[5].toString());
                    String formattedDate;
                    if (data[6] instanceof Timestamp) {
                        formattedDate = ((Timestamp) data[6]).toLocalDateTime().format(formatter);
                    } else if (data[6] instanceof LocalDateTime) {
                        formattedDate = ((LocalDateTime) data[6]).format(formatter);
                    } else {
                        formattedDate = data[6] != null ? data[6].toString() : "";
                    }
                    chatDisplayDto.setLastMessageTime(formattedDate);

                    list.add(chatDisplayDto);

                }
               /*  list = latestMessagesForLoggedInUser.stream().map(chatMessage -> {
                    ChatDisplayDto chatDisplayDto = new ChatDisplayDto();
                    chatDisplayDto.setRoomId(chatMessage.getChatRoom().getId());
                    chatDisplayDto.setName(Objects.equals(chatMessage.getReceiverId().getId(), loginUser.get().getId()) ? chatMessage.getSenderId().getName() : chatMessage.getReceiverId().getName());
                    chatDisplayDto.setLastMessage(chatMessage.getMessage());
                    chatDisplayDto.setProfilePic(Objects.equals(chatMessage.getReceiverId().getId(), loginUser.get().getId()) ? chatMessage.getSenderId().getProfilePic() : chatMessage.getReceiverId().getProfilePic());
                    chatDisplayDto.setLastMessageTime(chatMessage.getTimestamp().format(formatter));

                    return chatDisplayDto;
                }).toList();*/

                 userChatContactData.setChatDisplayDtos(list);
            }
            else {
            userChatContactData.setChatDisplayDtos(List.of());
            }

            return userChatContactData;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }

    }
}
