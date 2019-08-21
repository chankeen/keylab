import request from "@/utils/request.js"
import Qs from "qs"

export function c_unit_file(values) {//分判商邀請函
    return request({
        url: "api/data?page=unit_file&action=c_unit_file",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function r_unit_file(property_id) {//報價單
    return request({
        url: "api/data?page=unit_file&action=r_unit_file",
        method: "POST",
        data: Qs.stringify({
            property_id
        })
    })
}
export function u_unit_file(values) {//報價單
    return request({
        url: "api/data?page=unit_file&action=u_unit_file",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function d_unit_file(unit_file_id) {//報價單
    return request({
        url: "api/data?page=unit_file&action=d_unit_file",
        method: "POST",
        data: Qs.stringify({
            unit_file_id
        })
    })
}