import request from "@/utils/request.js"
import Qs from "qs"

export function c_notes(values) {//分判商邀請函
    return request({
        url: "api/data?page=notes&action=c_notes",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function r_notes(property_id) {//報價單
    return request({
        url: "api/data?page=notes&action=r_notes",
        method: "POST",
        data: Qs.stringify({
            property_id
        })
    })
}
export function u_notes(values) {//報價單
    return request({
        url: "api/data?page=notes&action=u_notes",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function d_notes(note_id) {//報價單
    return request({
        url: "api/data?page=notes&action=d_notes",
        method: "POST",
        data: Qs.stringify({
            note_id
        })
    })
}