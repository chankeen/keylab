import request from "@/utils/request.js"
import Qs from "qs"
//用戶數據

export function c_users(values) {
    return request({
        url: "api/data?page=users&action=c_users",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function r_users(admin_wp_id) {
    return request({
        url: "api/data?page=users&action=r_users",
        method: "POST",
        data: Qs.stringify({
            admin_wp_id
        })
    })
}
export function u_users(values) {
    return request({
        url: "api/data?page=users&action=u_users",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function d_users(users_id) {
    return request({
        url: "api/data?page=users&action=d_users",
        method: "POST",
        data: Qs.stringify({
            users_id
        })
    })
}