import request from "@/utils/request.js"
import Qs from "qs"
//用戶數據

export function get_users() {
    return request({
        url: "api/data?page=users&action=r_users",
        method: "POST",
        data: Qs.stringify({
            
        })
    })
}

