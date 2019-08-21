import request from "@/utils/request.js"
import Qs from "qs"

export function c_important(values) {//分判商邀請函
    return request({
        url: "api/data?page=important&action=c_important",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function r_important(property_id) {//報價單
    return request({
        url: "api/data?page=important&action=r_important",
        method: "POST",
        data: Qs.stringify({
            property_id
        })
    })
}
export function u_important(values) {//報價單
    return request({
        url: "api/data?page=important&action=u_important",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function d_important(important_id) {//報價單
    return request({
        url: "api/data?page=important&action=d_important",
        method: "POST",
        data: Qs.stringify({
            important_id
        })
    })
}