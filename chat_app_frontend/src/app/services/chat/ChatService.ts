
import axios from "axios";
import { getToken } from "../TokenService";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND+"chat/with/";

export const getChatsForDisplay = async (id: string) => {
    const url = baseUrl + "get-chats?contactId=" + id;
    let token=await getToken();
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
    let token=await getToken();
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