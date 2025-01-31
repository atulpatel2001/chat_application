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

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
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
            Optional<User> loginUser = this.userRepository.findByEmail(contact.getEmail());
             List<ChatMessage> chatsBetweenUsersDesc = this.chatMessageRepository.findChatsBetweenUsersDesc(chatWithUser.get(), loginUser.get());
             List<ChatMessage> latestMessagesForLoggedInUser = this.chatMessageRepository.findLatestMessagesForLoggedInUser(loginUser.get().getId());

             DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a");

            if(!chatsBetweenUsersDesc.isEmpty()){
                 ChatMessage chatMessage = chatsBetweenUsersDesc.get(0);
                 ChatDisplayDto build = ChatDisplayDto.builder().name(Objects.equals(chatMessage.getReceiverId().getId(), loginUser.get().getId()) ? chatMessage.getSenderId().getName() : chatMessage.getReceiverId().getName())
                        .lastMessage(chatMessage.getMessage())
                        .lastMessageTime(chatMessage.getTimestamp().format(formatter))
                        .profilePic(Objects.equals(chatMessage.getReceiverId().getId(), loginUser.get().getId()) ? chatMessage.getSenderId().getProfilePic() : chatMessage.getReceiverId().getProfilePic())
                        .roomId(chatMessage.getChatRoom().getId())
                        .build();
                 userChatContactData.setSingleEmployee(build);
            }
            else {
                userChatContactData.setSingleEmployee(null);
            }
            List<ChatDisplayDto> list=null;
            if (!latestMessagesForLoggedInUser.isEmpty()){
                 list = latestMessagesForLoggedInUser.stream().map(chatMessage -> {
                    ChatDisplayDto chatDisplayDto = new ChatDisplayDto();
                    chatDisplayDto.setRoomId(chatMessage.getChatRoom().getId());
                    chatDisplayDto.setName(Objects.equals(chatMessage.getReceiverId().getId(), loginUser.get().getId()) ? chatMessage.getSenderId().getName() : chatMessage.getReceiverId().getName());
                    chatDisplayDto.setLastMessage(chatMessage.getMessage());
                    chatDisplayDto.setProfilePic(Objects.equals(chatMessage.getReceiverId().getId(), loginUser.get().getId()) ? chatMessage.getSenderId().getProfilePic() : chatMessage.getReceiverId().getProfilePic());
                    chatDisplayDto.setLastMessageTime(chatMessage.getTimestamp().format(formatter));

                    return chatDisplayDto;
                }).toList();

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
