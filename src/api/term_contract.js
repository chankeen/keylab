import request from "@/utils/request.js"
import Qs from "qs"

export function c_term_contract(values) {//分判商邀請函
    return request({
        url: "api/data?page=term_contract&action=c_term_contract",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function r_term_contract(property_id) {//報價單
    return request({
        url: "api/data?page=term_contract&action=r_term_contract",
        method: "POST",
        data: Qs.stringify({
            property_id
        })
    })
}
export function u_term_contract(values) {//報價單
    return request({
        url: "api/data?page=term_contract&action=u_term_contract",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function d_term_contract(term_contract_id) {//報價單
    return request({
        url: "api/data?page=term_contract&action=d_term_contract",
        method: "POST",
        data: Qs.stringify({
            term_contract_id
        })
    })
}