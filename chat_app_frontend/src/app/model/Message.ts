 export interface ChatMessageDto {
    id: string;
    chatRoomId: string;
    senderId: string;
    receiverId?: string; // Optional, since it can be null for group messages
    message: string;
    timestamp: string;
    status: String;
    sender: string;
  }
  