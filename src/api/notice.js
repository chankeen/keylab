import request from "@/utils/request.js"
import Qs from "qs"

export function c_notice(values) {//分判商邀請函
    return request({
        url: "api/data?page=notice&action=c_notice",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function r_notice(property_id) {//報價單
    return request({
        url: "api/data?page=notice&action=r_notice",
        method: "POST",
        data: Qs.stringify({
            property_id
        })
    })
}
export function u_notice(values) {//報價單
    return request({
        url: "api/data?page=notice&action=u_notice",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function d_notice(notice_id) {//報價單
    return request({
        url: "api/data?page=notice&action=d_notice",
        method: "POST",
        data: Qs.stringify({
            notice_id
        })
    })
}