import request from "@/utils/request.js"
import Qs from "qs"

export function c_individual_contract_related_entity(values) {//分判商邀請函
    return request({
        url: "api/data?page=individual_contract_related_entity&action=c_individual_contract_related_entity",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function r_individual_contract_related_entity(individual_contract_id) {//報價單
    return request({
        url: "api/data?page=individual_contract_related_entity&action=r_individual_contract_related_entity",
        method: "POST",
        data: Qs.stringify({
            individual_contract_id
        })
    })
}
export function u_individual_contract_related_entity(values) {//報價單
    return request({
        url: "api/data?page=individual_contract_related_entity&action=u_individual_contract_related_entity",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function d_individual_contract_related_entity(individual_contract_related_entity_id) {//報價單
    return request({
        url: "api/data?page=individual_contract_related_entity&action=d_individual_contract_related_entity",
        method: "POST",
        data: Qs.stringify({
            individual_contract_related_entity_id
        })
    })
}