import { UserModel } from "@/app/model/UserModel";
import axios from "axios";

const baseUrl = "http://localhost:8081/chat/user/";
const token = localStorage.getItem("Chat_Auth_Token");
export const userInfo = async (userId: string) => {
    const url = baseUrl + "info?userId=" + userId;
    try {
        const response = await axios.get(url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        console.log(response.data)
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error != undefined) {
                const errorMessage: string = error.response?.data.errorCode;
                console.log(error)
                if (error.response?.status == 401) {
                    return {
                        success: false,
                        message: error.response?.data,
                        status: error.response?.status
                    }
                } else {
                    return {
                        success: false,
                        message: errorMessage,
                        status: error.response?.status
                    }
                }
            }
        }
    }
};


export const updateUser = async (userData: UserModel) => {
    const url = baseUrl + "update_user";
    try {
        let formData = new FormData();
        formData.append("userId", userData.userId);
        formData.append("name", userData.name);
        formData.append("email", userData.email);
        formData.append("password", userData.password);
        // formData.append("profilePic",userData.profilePic);
        formData.append("phoneNumber",userData.phoneNumber );
        //formData.append("provider", );
        formData.append("userImage",userData.userImage ? userData.userImage : 'null')
        const response = await axios.post(url, formData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        console.log(response.data)

        return {
            success: true,
            field: false,
            message: 'Profile updated successfully'
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error != undefined) {

                console.log(error.response);

                if (error.response?.status === 416) {
                    return {
                        success: false,
                        field: true,
                        message: error.response.data
                    }
                } else {
                    // return {
                    //     success: false,
                    //     field: false,
                    //     message: error.response?.data.errorMessage
                    // }
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
                            message: error.response?.data.errorMessage,
                            status: error.response?.status,
                            field: false,
                        }
                    }

                }
            }
        }
    }
}