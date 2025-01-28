export interface UserModel{
    userId:string;
    name:string;
    email: string;
    password:string;
    profilePic: string | null;
    phoneNumber: string;
    provider: string;
    userImage: File | null;

  }