import { ChatRoom } from "./ChatRoom";
import { UserModel } from "./UserModel";

export interface ChatParticipant{
    id:number;
    chatRoom:ChatRoom;
    chatRoomId:number,
    user:UserModel;
    userId:string;
    joinedAt:string;
}