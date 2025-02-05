import { LoginFormData } from "../chat/login/page";
import { UserForm } from "../chat/signup/page";
import axios from "axios";

import { login_, User } from "../redux/slice/authSlice";
import { AppDispatch } from "../redux/store/store";
import { Console } from "console";

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}
const baseUrl = "http://localhost:8081/chat/"
const baseUrl2 = "http://localhost:8081/"


export const signin = async (data: UserForm) => {
  const url = baseUrl + "signup";
  try {
    const response = await axios.post(url, data, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(response.data)
    return {
      success: true,
      message: "Successfully Register!!!",
      field: false
    };;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response)
        const { status, data } = error.response;
        console.log(data + "" + status)
        if (status === 400) {
          // Handle validation errors
          if (data.email == undefined) {
            return {
              success: false,
              errors: data.errors || data,
              field: false
            };
          }
        } else if (status === 416) {
          return {
            success: false,
            errors: data.errors || data,
            field: true
          };
        } else if (status === 500) {
          return {
            success: false,
            message: "An internal server error occurred. Please try again later.",
            field: false
          };
        }
      } else if (error.request) {
        return {
          success: false,
          message: "No response from the server. Please check your network connection.",
          field: false
        };
      }
    }

    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
};







export const login = async (data: LoginFormData, dispatch: AppDispatch) => {
  const url = baseUrl + "login";
  try {
    const response = await axios.post(url, data, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(response.data)
    const data2 = response.data;

    const userData: User = {
      email: data2.userName,
      id: data2.userId
    }
    dispatch(
      login_({
        user: userData,
        token: data2.jwtToken,
      })
    );

    return {
      success: true,
      message: data2.statusMsg,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error != undefined) {
        const errorResponse = error.response?.data.errorCode;
        if (errorResponse === "BAD_REQUEST") {
          console.log("errorResponse" + errorResponse);
          return {
            field: false,
            success: false,
            message: "Provide Valid username and password!!",

          }
        } else {
          console.log("field" + error.response?.data);
          return {
            success: false,
            errors: error.response?.data || error.response?.data,
            field: true
          }
        }



      }
    }
  };
}



export const thirdPartyLogin = async (providerType: string) => {
  const url: string = baseUrl2;
  console.log(url)
  window.location.href = url + "oauth2/authorization/" + providerType;
}