import { UserModel } from "@/app/model/UserModel";
import { fetchDefaultImageAsFile } from "@/app/util/ImageUtil";
import axios from "axios";
import { getToken } from "../TokenService";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND+"chat/user/";
// const token = localStorage.getItem("Chat_Auth_Token");
export const userInfo = async (userId: string) => {
    const url = baseUrl + "info?userId=" + userId;
    let token=await getToken();
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
    let token=await getToken();
    try {
        let formData = new FormData();
        formData.append("userDto", new Blob([JSON.stringify({
            userId: userData.userId,
            name: userData.name,
            email: userData.email,
            password: userData.password,
            phoneNumber: userData.phoneNumber
        })], { type: "application/json" }));

        // if (userData.userImage) {
        //     formData.append("userImage", userData.userImage);
        // }

        // const defaultImage = new File([""], "/user_img3.png", { type: "image/png" });
        const defaultImage= await fetchDefaultImageAsFile("user_img3.png")
        if (userData.userImage == null) {
            console.log(defaultImage+" default image")
            formData.append("userImage", defaultImage);
        } else {
            formData.append("userImage", userData.userImage);
            console.log(userData.userImage+"userImagedddd");
        }
        console.log(formData)
        const response = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        });

        console.log(response.data)

        return {
            success: true,
            field: false,
            message: 'Profile updated successfully'
        }
    } catch (error) {console.log(error);
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