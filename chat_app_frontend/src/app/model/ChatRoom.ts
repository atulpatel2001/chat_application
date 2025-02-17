import { UserModel } from "./UserModel";

export interface ChatRoom {
     id: string;
     type: string;
     name: string;
     image:File | null;
     groupImage:string;
     participants:UserModel[]
}

export interface ChatRoomDto {
     id: string;
     type: string;
     name: string;
     image:File | null;
     groupImage:string;
     participants:ChatParticipantDto[]
}
export interface ChatParticipantDto{
     id:string;
     user:UserDto;
     joinedAt:string;
     isAdmin:boolean;
}

export interface UserDto{
     id:string;
     name:string;
     email: string;
     profilePic: string | null;
     phoneNumber: string;
}


export interface ChatMessageDto {
     id: string;
     chatRoomId: string;
     senderId: string;
     receiverId?: string; // Optional, since it can be null for group messages
     message: string;
     timestamp: string;
     status: String;
     sender: string;
     senderUser:UserDto;
     receiverUser:UserDto;
   }