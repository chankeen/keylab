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
<<<<<<< HEAD
            admin_wp_id
=======

        })
    })
}
export function c_users(values) {
    return request({
        url: "api/data?page=users&action=c_users",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function d_users(user_id) {
    return request({
        url: "api/data?page=users&action=d_users",
        method: "POST",
        data: Qs.stringify({
            user_id
        })
    })
}
export function u_users(values) {
    return request({
        url: "api/data?page=users&action=u_users",
        method: "POST",
        data: Qs.stringify({
            ...values
>>>>>>> 41fce80bbdbe3c052aac3361de4de1c60f5ffe3d
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