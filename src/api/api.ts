import axios, { AxiosResponse } from "axios"
import { ApiConfig } from "../config/api.config"

export default function api(
    path: string,
    method: "get" | "post" | "patch" | "delete",
    body: any | undefined,
    role: 'user' | 'administrator' = 'user',
) {


    return new Promise<ApiResponse>((resolve) => {
        const requestData = {
            method: method,
            url: path,
            baseURL: ApiConfig.API_URL,
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getToken(role)
            }
        }


        axios(requestData)
            .then(res => responseHandler(res, resolve))
            .catch(err => {

                if (err.response.status === 401) {
                    const response: ApiResponse = {
                        status: 'login',
                        data: null
                    }
                    return resolve(response);
                }
                const response: ApiResponse = {
                    status: 'error',
                    data: err
                }
                resolve(response)

            });
    })

}

export interface ApiResponse {
    status: 'ok' | 'error' | 'login',
    data: any
}


function responseHandler(
    res: AxiosResponse<any>,
    resolve: (value: ApiResponse) => void
) {
    if (res.status < 200 || res.status >= 300) {
        const response: ApiResponse = {
            status: 'error',
            data: res.data
        }
        return resolve(response);
    }

    const response: ApiResponse = {
        status: 'ok',
        data: res.data
    }
    return resolve(response)
}



export function getToken(role: 'user' | 'administrator') {
    const token = localStorage.getItem('api_token' + role)
    return 'Barer ' + token

}

export function saveToken(role: 'user' | 'administrator', token: string) {

    localStorage.setItem('api_token' + role, token)
}

export function removeToken(role: 'user' | 'administrator') {
    localStorage.removeItem('api_token' + role)
}