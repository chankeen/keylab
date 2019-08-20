import request from "@/utils/request.js"
import Qs from "qs"
export function login(login, password) {
    return request({
        url: "api/login",
        method: "POST",
        data: Qs.stringify({
            login, password
        })
    })
}
export function logout() {
    return request({
        url: "api/logout",
        method: "POST",
        data: Qs.stringify({

        })
    })
}