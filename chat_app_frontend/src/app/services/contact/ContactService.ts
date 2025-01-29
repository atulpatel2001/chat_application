import { Contact } from "@/app/model/Contact";
import { fetchDefaultImageAsFile } from "@/app/util/ImageUtil";
import axios from "axios";

const baseUrl = "http://localhost:8081/chat/contact/";
const token = localStorage.getItem("Chat_Auth_Token");


export const addContact = async (contactData: Contact) => {
    const url = baseUrl + "add-contact";
    try {
        let formData = new FormData();
       
        const contactDto = {
            name: contactData.name,
            email: contactData.email,
            phoneNumber: contactData.phoneNumber,
            address: contactData.address,
            description: contactData.description,
            favorite: contactData.favorite,
            links: contactData.links?.map(link => ({
                link: link.url,
                title: link.title || ""  // Ensure the title is set
            })) || []
        };

        formData.append("contactDto", new Blob([JSON.stringify(contactDto)], { type: "application/json" }));
        console.log(contactDto);
        // if (userData.userImage) {
        //     formData.append("userImage", userData.userImage);
        // }

        // const defaultImage = new File([""], "/user_img3.png", { type: "image/png" });
        const defaultImage= await fetchDefaultImageAsFile("user_img3.png")
        if (contactData.contact_image== null) {
            console.log(defaultImage+" default image")
            formData.append("contact_image", defaultImage);
        } else {
            formData.append("contact_image",contactData.contact_image);
            console.log(contactData.contact_image+"userImagedddd");
        }
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