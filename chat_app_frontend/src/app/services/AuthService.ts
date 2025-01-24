import { LoginFormData } from "../chat/login/page";
import { UserForm } from "../chat/signin/page";
import axios from "axios";


export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
  }
  const baseUrl="http://localhost:8081/chat/"



  export const signin = async (data:UserForm)=> {
    const url = baseUrl+"signup";
    try {
        const response = await axios.post(url, data, {
          headers: { "Content-Type": "application/json" },
        });
        console.log(response.data)
         return {
          success: true,
          message: "Successfully Register!!!",
          field:false
        };;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            const { status, data } = error.response;
            if (status === 400) {
              // Handle validation errors
              if(data.email == undefined){
              return {
                success: false,
                errors: data.errors || data,
                field:false
              };
            }else{
                return {
                    success: false,
                    errors: data.errors || data,
                    field:true
                  };
            }
            } else if (status === 500) {
              return {
                success: false,
                message: "An internal server error occurred. Please try again later.",
                field:false
              };
            }
          } else if (error.request) {
            return {
              success: false,
              message: "No response from the server. Please check your network connection.",
              field:false
            };
          }
        }
    
        return {
          success: false,
          message: "An unexpected error occurred. Please try again later.",
        };
      }
  };



  



  export const login = async (data:LoginFormData)=> {
    const url = baseUrl+"login";
    try {
        const response:any = await axios.post(url, data, {
          headers: { "Content-Type": "application/json" },
        });
         console.log(response.data)
         const data2=response.data;
         localStorage.setItem('Chat_Token', data2.jwtToken);
         localStorage.setItem('Chat_UseName', data2.userName);
         localStorage.setItem('Chat_Id', data2.userId);
         console.log("token---->"+data2.jwtToken);
         console.log("userId---->"+data2.userName);
         console.log("userName---->"+data2.userId);
        return {
          success: true,
          message:data2.statusMsg,
        }; 
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if(error != undefined){
          const  errorResponse  =  error.response?.data.errorCode;
             if(errorResponse === "BAD_REQUEST"){
              console.log("errorResponse"+errorResponse);
              return {
                field:false,
                success: false,
                message: "Provide Valid username and password!!",
                
             }
            }else{
              console.log("field"+error.response?.data);
              return{
                    success: false,
                    errors: error.response?.data || error.response?.data,
                    field:true
              }
             }
      
       
        
      }
    }
  };
}



  export const thirdPartyLogin = async (providerType:String)=> {
    const url = baseUrl;
    try {
        const response:any = await axios.post(url);
        console.log(response.data)
         const data2=response.data;
        //  localStorage.setItem('Chat_Token', data2.jwtToken);
        //  localStorage.setItem('Chat_UseName', data2.userName);
        //  localStorage.setItem('Chat_Id', data2.userId);
        //  console.log("token---->"+data2.jwtToken);
        //  console.log("userId---->"+data2.userName);
        //  console.log("userName---->"+data2.userId);
        return {
          success: true,
          message:data2.statusMsg,
        }; 
      } catch (error) {
        if (axios.isAxiosError(error)) {
      //     if(error != undefined){
      //     const  errorResponse  =  error.response?.data.errorCode;
      //        if(errorResponse === "BAD_REQUEST"){
      //         console.log("errorResponse"+errorResponse);
      //         return {
      //           field:false,
      //           success: false,
      //           message: "Provide Valid username and password!!",
                
      //        }
      //       }else{
      //         console.log("field"+error.response?.data);
      //         return{
      //               success: false,
      //               errors: error.response?.data || error.response?.data,
      //               field:true
      //         }
      //        }
      
       
        
      // }
    }
  };
}