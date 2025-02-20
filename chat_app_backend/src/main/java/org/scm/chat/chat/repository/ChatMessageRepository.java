package org.scm.chat.chat.repository;

import jakarta.transaction.Transactional;
import org.scm.chat.chat.model.ChatMessage;
import org.scm.chat.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
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
                                                 g.id AS chat_room_id,
                                                 u.id AS user_id,
                                                 u.user_name,
                                                 u.email,
                                                 u.profile_picture,
                                                 m.content,
                                                 m.timestamp
                                             FROM chat_participants gm
                                             JOIN chat_rooms g ON gm.chat_room_id = g.id
                                             JOIN chat_participants gm2 ON g.id = gm2.chat_room_id
                                             JOIN user_master u ON gm2.user_id = u.id
                                             LEFT JOIN chat_messages m ON g.id = m.chat_room_id
                                                 AND m.timestamp = (
                                                     SELECT MAX(m2.timestamp)
                                                     FROM chat_messages m2
                                                     WHERE m2.chat_room_id = g.id
                                                 )
                                             WHERE gm.user_id = :loggedInUserId\s
                                               AND gm2.user_id != :loggedInUserId\s
                                               AND g.chat_type = 'SINGLE' ORDER BY m.timestamp DESC;
            
            
            
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
                   g.id AS chat_room_id,
                   u.id AS user_id,
                   u.user_name,
                   u.email,
                   u.profile_picture,
                   m.content,
                   m.timestamp
               FROM chat_participants gm
               JOIN chat_rooms g ON gm.chat_room_id = g.id
               JOIN chat_participants gm2 ON g.id = gm2.chat_room_id
               JOIN user_master u ON gm2.user_id = u.id
               LEFT JOIN chat_messages m ON g.id = m.chat_room_id
                   AND m.timestamp = (
                       SELECT MAX(m2.timestamp)
                       FROM chat_messages m2
                       WHERE m2.chat_room_id = g.id
                   )
               WHERE gm.user_id = :loggedInUserId
                 AND gm2.user_id = :selectedUser  -- Filter for specific user
                 AND g.chat_type = 'SINGLE' ORDER BY m.timestamp DESC;
               """, nativeQuery = true)
    List<Object[]> getSingleUserLastMessageDataForDisplay(@Param("loggedInUserId") String loggedInUserId,
                                                          @Param("selectedUser") String selectedUser);

    List<ChatMessage> findByChatRoomIdOrderByCreatedAtAsc(Long chatRoomId);

    @Modifying
    @Transactional
    @Query("UPDATE ChatMessage m SET m.status = :status WHERE m.chatRoom.id = :roomId AND m.receiverId.id = :userId AND m.status <> 'READ'")
    void updateMessageStatus(@Param("roomId") String roomId, @Param("userId") String userId, @Param("status") ChatMessage.MessageStatus status);


    @Modifying
    @Transactional
    @Query("UPDATE ChatMessage m SET m.status = 'READ' WHERE m.chatRoom.id = :roomId AND m.receiverId.id = :userId AND m.status <> 'READ'")
    void updateMessageStatusToRead(@Param("roomId") String roomId, @Param("userId") String userId);


    @Query("select m from ChatMessage m WHERE m.chatRoom.id = :roomId AND m.status <> 'READ' And m.status <> 'DELIVERED' ")
    List<ChatMessage> findByRoomId(Long roomId);
}
