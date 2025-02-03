package org.scm.chat.chat.repository;

import org.scm.chat.chat.model.ChatMessage;
import org.scm.chat.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage,Long> {

    @Query("""
    SELECT cm 
    FROM ChatMessage cm 
    WHERE 
        (cm.senderId = :loggedInUserId AND cm.receiverId = :otherUserId) OR 
        (cm.senderId = :otherUserId AND cm.receiverId = :loggedInUserId)
    ORDER BY cm.createdAt ASC
""")
    List<ChatMessage> findChatsBetweenUsers(@Param("loggedInUserId") User loggedInUserId,
                                            @Param("otherUserId") User otherUserId);


    @Query("""
    SELECT cm 
    FROM ChatMessage cm 
    WHERE 
        (cm.senderId.id = :loggedInUserId AND cm.receiverId.id = :otherUserId) OR 
        (cm.senderId.id = :otherUserId AND cm.receiverId.id = :loggedInUserId)
    ORDER BY cm.createdAt desc
""")
    List<ChatMessage> findChatsBetweenUsersDesc(@Param("loggedInUserId") String loggedInUserId,
                                                @Param("otherUserId") String otherUserId);


   /* @Query(value = "SELECT DISTINCT u.id,g.id, u.user_name, u.email, u.profile_picture, m.content, m.timestamp\n" +
            "FROM chat_participants gm\n" +
            "JOIN chat_rooms g ON gm.chat_room_id = g.id\n" +
            "JOIN chat_messages m ON g.id = m.chat_room_id\n" +
            "JOIN user_master u ON (m.sender_id = u.id OR gm.user_id = u.id)\n" +
            "WHERE gm.user_id = :loggedInUserId -- Logged-in user ID\n" +
            "  AND u.id != :loggedInUserId -- Exclude the logged-in user\n" +
            "  AND g.chat_type = 'SINGLE'\n" +
            "  AND m.timestamp = (\n" +
            "      SELECT MAX(m2.timestamp)\n" +
            "      FROM chat_messages m2\n" +
            "      WHERE m2.chat_room_id = g.id\n" +
            "        AND (m2.sender_id = u.id OR m2.sender_id = gm.user_id)\n" +
            "  );",nativeQuery = true)
    List<Object[]> findLatestMessagesForLoggedInUser(@Param("loggedInUserId") String loggedInUserId);*/
   @Query(value = """
    SELECT DISTINCT 
        u.id AS user_id, 
        g.id AS chat_room_id, 
        u.user_name, 
        u.email, 
        u.profile_picture, 
        m.content, 
        m.timestamp
    FROM chat_participants gm
    JOIN chat_rooms g ON gm.chat_room_id = g.id
    JOIN user_master u ON u.id != :loggedInUserId  -- Get the other participant
    LEFT JOIN chat_messages m ON g.id = m.chat_room_id 
        AND m.timestamp = ( 
            SELECT MAX(m2.timestamp) 
            FROM chat_messages m2 
            WHERE m2.chat_room_id = g.id 
        )
    WHERE gm.user_id = :loggedInUserId  
      AND g.chat_type = 'SINGLE';
""", nativeQuery = true)
   List<Object[]> findLatestMessagesForLoggedInUser(@Param("loggedInUserId") String loggedInUserId);

    /*@Query(value = "\n" +
            "  SELECT DISTINCT u.id,g.id, u.user_name, u.email, u.profile_picture, m.content, m.timestamp\n" +
            "FROM chat_participants gm\n" +
            "JOIN chat_rooms g ON gm.chat_room_id = g.id\n" +
            "JOIN chat_messages m ON g.id = m.chat_room_id\n" +
            "JOIN user_master u ON m.sender_id = u.id\n" +
            "WHERE gm.user_id = :loggedInUserId -- Logged-in user ID\n" +
            "  AND u.id = :selectedUser  -- Replace with the actual selected user ID\n" +
            "  AND g.chat_type = 'SINGLE'\n" +
            "  AND m.timestamp = (\n" +
            "      SELECT MAX(m2.timestamp)\n" +
            "      FROM chat_messages m2\n" +
            "      WHERE m2.chat_room_id = g.id\n" +
            "        AND m2.sender_id = u.id\n" +
            "  );",nativeQuery = true)
    List<Object[]> getSingleUserLastMessageDataForDisplay(@Param("loggedInUserId") String loggedInUserId,@Param("selectedUser")String selectedUser);*/

    @Query(value = """
    SELECT DISTINCT 
        u.id AS user_id, 
        g.id AS chat_room_id, 
        u.user_name, 
        u.email, 
        u.profile_picture, 
        m.content, 
        m.timestamp
    FROM chat_participants gm
    JOIN chat_rooms g ON gm.chat_room_id = g.id
    JOIN user_master u ON u.id = :selectedUser -- Ensure the correct participant
    LEFT JOIN chat_messages m ON g.id = m.chat_room_id 
        AND m.timestamp = ( 
            SELECT MAX(m2.timestamp) 
            FROM chat_messages m2 
            WHERE m2.chat_room_id = g.id
              AND (m2.sender_id = :selectedUser OR m2.sender_id = :loggedInUserId)
        )
    WHERE gm.user_id = :loggedInUserId  
      AND g.chat_type = 'SINGLE';
""", nativeQuery = true)
    List<Object[]> getSingleUserLastMessageDataForDisplay(@Param("loggedInUserId") String loggedInUserId,
                                                          @Param("selectedUser") String selectedUser);

    List<ChatMessage> findByChatRoomIdOrderByCreatedAtAsc(Long chatRoomId);
}
