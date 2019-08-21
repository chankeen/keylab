import request from "@/utils/request.js"
import Qs from "qs"

export function c_unit_fee(values) {//分判商邀請函
    return request({
        url: "api/data?page=unit_fee&action=c_unit_fee",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function r_unit_fee(property_id) {//報價單
    return request({
        url: "api/data?page=unit_fee&action=r_unit_fee",
        method: "POST",
        data: Qs.stringify({
            property_id
        })
    })
}
export function u_unit_fee(values) {//報價單
    return request({
        url: "api/data?page=unit_fee&action=u_unit_fee",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function d_unit_fee(unit_fee_id) {//報價單
    return request({
        url: "api/data?page=unit_fee&action=d_unit_fee",
        method: "POST",
        data: Qs.stringify({
            unit_fee_id
        })
    })
}