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
            userId:contactData.userId,
            links: contactData.links?.map(link => ({
                link: link.link,
                title: link.title || ""  // Ensure the title is set
            })) || []
        };

        formData.append("contactDto", new Blob([JSON.stringify(contactDto)], { type: "application/json" }));
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

        //console.log(response.data)

        return {
            success: true,
            field: false,
            message: 'Contact Added successfully'
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error != undefined) {

               // console.log(error.response);

                if (error.response?.status === 416) {
                    return {
                        success: false,
                        field: true,
                        message: error.response.data,
                        status: error.response?.status,
                    }
                } else {
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
}




export const getContacts = async () => {
    const url = baseUrl + "get-contact";
    try {
        
        const response = await axios.get(url,{
            headers: {
                "Content-Type": "multipart/form-data",
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



export const getContactsById = async (id:string) => {
    const url = baseUrl + "get-contact-by-id?contactId="+id;
    try {
        
        const response = await axios.get(url,{
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

      // console.log(response.data)

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


export const updateContact = async (contactData: Contact,id:string) => {
    const url = baseUrl + "update-contact";
    try {
        let formData = new FormData();
       
        const contactDto = {
            name: contactData.name,
            email: contactData.email,
            phoneNumber: contactData.phoneNumber,
            address: contactData.address,
            description: contactData.description,
            favorite: contactData.favorite,
            userId:contactData.userId,
            links: contactData.links?.map(link => ({
                id:link.id,
                link: link.link,
                title: link.title || "" 
            })) || []
        };
        formData.append("id",id || '');
        formData.append("contactDto", new Blob([JSON.stringify(contactDto)], { type: "application/json" }));
        console.log(contactDto);
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

       // console.log(response.data)

        return {
            success: true,
            field: false,
            message: 'Contact Update successfully'
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error != undefined) {

                console.log(error.response);

                if (error.response?.status === 416) {
                    return {
                        success: false,
                        field: true,
                        message: error.response.data,
                        status: error.response?.status,
                    }
                } else {
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
}




export const deleteContactsById = async (id:string) => {
    const url = baseUrl + "delete-contact-by-id?contactId="+id;
    try {
        
        const response = await axios.delete(url,{
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

       // console.log(response.data)

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



export const isApplicableContactsById = async (id:string) => {
    const url = baseUrl + "inapplicable-for-chat?contactId="+id;
    try {
        
        const response = await axios.get(url,{
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

       // console.log(response.data)

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
                            message: error.response?.data,
                            status: error.response?.status,
                        }
                    }

            
            }
        }
    }
}