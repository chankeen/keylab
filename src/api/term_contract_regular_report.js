import request from "@/utils/request.js"
import Qs from "qs"

export function c_term_contract_regular_report(values) {//分判商邀請函
    console.log(values);
    return request({
        url: "api/data?page=term_contract_regular_report&action=c_term_contract_regular_report",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function r_term_contract_regular_report(term_contract_id) {//報價單
    return request({
        url: "api/data?page=term_contract_regular_report&action=r_term_contract_regular_report",
        method: "POST",
        data: Qs.stringify({
            term_contract_id
        })
    })
}
export function u_term_contract_regular_report(values) {//報價單
    return request({
        url: "api/data?page=term_contract_regular_report&action=u_term_contract_regular_report",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function d_term_contract_regular_report(regular_report_id) {//報價單
    return request({
        url: "api/data?page=term_contract_regular_report&action=d_term_contract_regular_report",
        method: "POST",
        data: Qs.stringify({
            regular_report_id
        })
    })
}