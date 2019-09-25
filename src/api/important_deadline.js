import request from "@/utils/request.js"
import Qs from "qs"

export function c_important_deadline(values) {//分判商邀請函
    return request({
        url: "api/data?page=important_deadline&action=c_important_deadline",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function r_important_deadline(important_id) {//報價單
    return request({
        url: "api/data?page=important_deadline&action=r_important_deadline",
        method: "POST",
        data: Qs.stringify({
            important_id
        })
    })
}
export function u_important_deadline(values) {//報價單
    return request({
        url: "api/data?page=important_deadline&action=u_important_deadline",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function d_important_deadline(important_deadline_id) {//報價單
    return request({
        url: "api/data?page=important_deadline&action=d_important_deadline",
        method: "POST",
        data: Qs.stringify({
            important_deadline_id
        })
    })
}