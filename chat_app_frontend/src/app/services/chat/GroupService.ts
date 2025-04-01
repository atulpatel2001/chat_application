
import axios from "axios";
import { getToken } from "../TokenService";
import { ChatRoomDto } from "@/app/model/ChatRoom";
import { fetchDefaultImageAsFile } from "@/app/util/ImageUtil";
import { Contact } from "@/app/model/Contact";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND + "chat/group/";
export const create = async (data: ChatRoomDto) => {
    let url = baseUrl + "create";
    let token = await getToken();

    try {
        let formData = new FormData();
        formData.append("name", data.name);

        const defaultImage = await fetchDefaultImageAsFile("avatar.jpg")
        if (data.image == null) {
            formData.append("image", defaultImage);
        } else {
            formData.append("image", data.image);
        }

        const response = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        });
        console.log(response);
        return {
            success: true,
            message: response.data
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error != undefined) {
                if (error.response?.status == 401) {
                    return {
                        success: false,
                        message: error.response?.data,
                        status: error.response?.status,
                        field: false,
                    }
                } else {
                    return {
                        success: false,
                        message: error.response?.data,
                        status: error.response?.status,
                        field: false,
                    }
                }


            }
        }
    }

}



export const getRooms = async () => {
    let url = baseUrl + "get-rooms";
    let token = await getToken();

    try {
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        });
        console.log(response);
        return {
            success: true,
            message: response.data
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error != undefined) {
                if (error.response?.status == 401) {
                    return {
                        success: false,
                        message: error.response?.data,
                        status: error.response?.status,
                        field: false,
                    }
                } else {
                    return {
                        success: false,
                        message: error.response?.data,
                        status: error.response?.status,
                        field: false,
                    }
                }


            }
        }
    }

}


export const updateGroupDetailData = async (id: string, groupName: string, groupImage: File | null) => {
    let url = baseUrl + "update-room";
    let token = await getToken();

    try {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('name', groupName);
        if (groupImage !== null) {
            formData.append('groupImage', groupImage);
        }

        const response = await axios.put(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        });
        console.log(response);
        return {
            success: true,
            message: response.data
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error != undefined) {
                if (error.response?.status == 401) {
                    return {
                        success: false,
                        message: error.response?.data,
                        status: error.response?.status,
                        field: false,
                    }
                } else {
                    return {
                        success: false,
                        message: error.response?.data,
                        status: error.response?.status,
                        field: false,
                    }
                }


            }
        }
    }

}


export const addParticipant_= async(groupId:string,user:Contact) =>{
    let url = baseUrl + "add-participant";
    let token = await getToken();

    try {
        const formData = new FormData();
       formData.append('groupId', groupId);
       formData.append('email',user.email);
       formData.append('id',user.id || "");
       formData.append('contactUserId',user.contactUser_Id);
       formData.append('userId',user.userId);

        const response = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        });
        console.log(response);
        return {
            success: true,
            message: response.data
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error != undefined) {
                if (error.response?.status == 401) {
                    return {
                        success: false,
                        message: error.response?.data,
                        status: error.response?.status,
                        field: false,
                    }
                } else {
                    return {
                        success: false,
                        message: error.response?.data,
                        status: error.response?.status,
                        field: false,
                    }
                }


            }
        }
    }

}





export const getChats = async (roomId:string) => {
    let url = baseUrl + "get-messages?groupId="+roomId;
    let token = await getToken();

    try {
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        });
        console.log(response);
        return {
            success: true,
            message: response.data
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error != undefined) {
                if (error.response?.status == 401) {
                    return {
                        success: false,
                        message: error.response?.data,
                        status: error.response?.status,
                        field: false,
                    }
                } else {
                    return {
                        success: false,
                        message: error.response?.data,
                        status: error.response?.status,
                        field: false,
                    }
                }


            }
        }
    }

}


export const removeParticipant = async (roomId:string,userId:string) => {
    let url = baseUrl + "removeParticipant?groupId="+roomId+"&userId="+userId;
    let token = await getToken();

    try {
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        });
        console.log(response);
        return {
            success: true,
            message: response.data
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error != undefined) {
                if (error.response?.status == 401) {
                    return {
                        success: false,
                        message: error.response?.data,
                        status: error.response?.status,
                        field: false,
                    }
                } else {
                    return {
                        success: false,
                        message: error.response?.data,
                        status: error.response?.status,
                        field: false,
                    }
                }


            }
        }
    }

}
