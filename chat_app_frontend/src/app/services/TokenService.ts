import { User } from "../redux/slice/authSlice";

export const getToken = async () => {

    return localStorage.getItem("Chat_Auth_Token");
};


export const getUserDetail = async () => {
    let user=localStorage.getItem("Chat_User");
    const user2: User = JSON.parse(user || "");
    return user2;
};