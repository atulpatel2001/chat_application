import { ChatRoom } from "./ChatRoom";

export interface ChatMessage{
    id:number,
    chatRoom:ChatRoom,
    chatRoomId:number,
    senderId:string,
    receiverId:string,
    message:string,
    
}