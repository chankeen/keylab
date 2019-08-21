import request from "@/utils/request.js"
import Qs from "qs"

export function c_minutes(values) {//分判商邀請函
    return request({
        url: "api/data?page=minutes&action=c_minutes",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function r_minutes(property_id) {//報價單
    return request({
        url: "api/data?page=minutes&action=r_minutes",
        method: "POST",
        data: Qs.stringify({
            property_id
        })
    })
}
export function u_minutes(values) {//報價單
    return request({
        url: "api/data?page=minutes&action=u_minutes",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function d_minutes(minutes_id) {//報價單
    return request({
        url: "api/data?page=minutes&action=d_minutes",
        method: "POST",
        data: Qs.stringify({
            minutes_id
        })
    })
}