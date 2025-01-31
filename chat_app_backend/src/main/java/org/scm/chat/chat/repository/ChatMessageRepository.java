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
        (cm.senderId = :loggedInUserId AND cm.receiverId = :otherUserId) OR 
        (cm.senderId = :otherUserId AND cm.receiverId = :loggedInUserId)
    ORDER BY cm.createdAt desc 
""")
    List<ChatMessage> findChatsBetweenUsersDesc(@Param("loggedInUserId") User loggedInUserId,
                                            @Param("otherUserId") User otherUserId);

    @Query("""
    SELECT cm 
    FROM ChatMessage cm
    WHERE cm.timestamp = (
        SELECT MAX(subCm.timestamp)
        FROM ChatMessage subCm
        WHERE (subCm.senderId.id = :loggedInUserId AND subCm.receiverId.id = cm.receiverId.id)
           OR (subCm.senderId.id = cm.receiverId.id AND subCm.receiverId.id = :loggedInUserId)
    )
    AND (
        (cm.senderId.id = :loggedInUserId AND cm.receiverId.id IS NOT NULL)
        OR (cm.receiverId.id = :loggedInUserId AND cm.senderId.id IS NOT NULL)
    )
    ORDER BY cm.timestamp DESC
""")
    List<ChatMessage> findLatestMessagesForLoggedInUser(@Param("loggedInUserId") String loggedInUserId);
}
