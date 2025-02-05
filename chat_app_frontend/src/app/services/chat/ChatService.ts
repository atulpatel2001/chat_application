
import axios from "axios";

const baseUrl = "http://localhost:8081/chat/with/";
const token = localStorage.getItem("Chat_Auth_Token");

export const getChatsForDisplay = async (id: string) => {
    const url = baseUrl + "get-chats?contactId=" + id;
    try {

        const response = await axios.get(url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        //console.log(response.data)

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
                    }
                } else {
                    return {
                        success: false,
                        message: "Something Went Wrong Try Again After Some Time!!",
                        status: error.response?.status,
                    }
                }


            }
        }
    }
}



export const getMessageByGroupId = async (id: string) => {
    const url = baseUrl + "get-messages?roomId=" + id;
    try {

        const response = await axios.get(url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
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
                    }
                } else {
                    return {
                        success: false,
                        message: "Something Went Wrong Try Again After Some Time!!",
                        status: error.response?.status,
                    }
                }


            }
        }
    }
}