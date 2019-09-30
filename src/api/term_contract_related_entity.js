import request from "@/utils/request.js"
import Qs from "qs"

export function c_term_contract_related_entity(values) {//分判商邀請函
    return request({
        url: "api/data?page=term_contract_related_entity&action=c_term_contract_related_entity",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function r_term_contract_related_entity(term_contract_id) {//報價單
    return request({
        url: "api/data?page=term_contract_related_entity&action=r_term_contract_related_entity",
        method: "POST",
        data: Qs.stringify({
            term_contract_id
        })
    })
}
export function u_term_contract_related_entity(values) {//報價單
    return request({
        url: "api/data?page=term_contract_related_entity&action=u_term_contract_related_entity",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function d_term_contract_related_entity(term_contract_related_entity_id) {//報價單
    return request({
        url: "api/data?page=term_contract_related_entity&action=d_term_contract_related_entity",
        method: "POST",
        data: Qs.stringify({
            term_contract_related_entity_id
        })
    })
}