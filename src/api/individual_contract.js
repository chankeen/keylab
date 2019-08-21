import request from "@/utils/request.js"
import Qs from "qs"

export function c_individual_contract(values) {//分判商邀請函
    return request({
        url: "api/data?page=individual_contract&action=c_individual_contract",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function r_individual_contract(property_id) {//報價單
    return request({
        url: "api/data?page=individual_contract&action=r_individual_contract",
        method: "POST",
        data: Qs.stringify({
            property_id
        })
    })
}
export function u_individual_contract(values) {//報價單
    return request({
        url: "api/data?page=individual_contract&action=u_individual_contract",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function d_individual_contract(individual_contract_id) {//報價單
    return request({
        url: "api/data?page=individual_contract&action=d_individual_contract",
        method: "POST",
        data: Qs.stringify({
            individual_contract_id
        })
    })
}