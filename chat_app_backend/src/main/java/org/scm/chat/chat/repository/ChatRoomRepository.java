package org.scm.chat.chat.repository;

import org.scm.chat.chat.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom,Long> {

    @Query(value = "SELECT g.id\n" +
            "FROM public.chat_rooms g\n" +
            "JOIN chat_participants gm1 ON g.id = gm1.chat_room_id\n" +
            "JOIN chat_participants gm2 ON g.id = gm2.chat_room_id\n" +
            "WHERE g.chat_type = 'SINGLE'\n" +
            "  AND gm1.user_Id = :loginUserId \n" +
            "  AND gm2.user_Id = :chatWithUserId\n" +
            "LIMIT 1;",nativeQuery = true)
    public Long findBetweenTwoUserGroupExists(String loginUserId,String chatWithUserId);

    @Query("SELECT cr FROM ChatRoom cr " +
            "JOIN cr.participants cp " +
            "WHERE cp.user.id = :userId AND cr.isDeleted = false AND cp.isDeleted = false AND cr.type = 'GROUP'")
    List<ChatRoom> findChatRoomsByUserId(String userId);

}
