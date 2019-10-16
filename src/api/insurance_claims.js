import request from "@/utils/request.js"
import Qs from "qs"

export function c_insurance_claims(values) {//分判商邀請函
    return request({
        url: "api/data?page=insurance_claims&action=c_insurance_claims",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function r_insurance_claims(property_id) {//報價單
    return request({
        url: "api/data?page=insurance_claims&action=r_insurance_claims",
        method: "POST",
        data: Qs.stringify({
            property_id
        })
    })
}
export function u_insurance_claims(values) {//報價單
    return request({
        url: "api/data?page=insurance_claims&action=u_insurance_claims",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function d_insurance_claims(insurance_claims_id) {//報價單
    return request({
        url: "api/data?page=insurance_claims&action=d_insurance_claims",
        method: "POST",
        data: Qs.stringify({
            insurance_claims_id
        })
    })
}