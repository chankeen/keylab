import request from "@/utils/request.js"
import Qs from "qs"

export function created_in_form(values) {//分判商邀請函
    return request({
        url: "export-eso-in",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function created_q_form(values) {//報價單
    return request({
        url: "export-eso-q",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}