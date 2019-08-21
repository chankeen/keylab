import request from "@/utils/request.js"
import Qs from "qs"

export function c_unit_list(values) {//分判商邀請函
    return request({
        url: "api/data?page=unit_list&action=c_unit_list",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function r_unit_list(property_id) {//報價單
    return request({
        url: "api/data?page=unit_list&action=r_unit_list",
        method: "POST",
        data: Qs.stringify({
            property_id
        })
    })
}
export function u_unit_list(values) {//報價單
    return request({
        url: "api/data?page=unit_list&action=u_unit_list",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function d_unit_list(unit_id) {//報價單
    return request({
        url: "api/data?page=unit_list&action=d_unit_list",
        method: "POST",
        data: Qs.stringify({
            unit_id
        })
    })
}