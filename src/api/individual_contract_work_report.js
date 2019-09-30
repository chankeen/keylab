import request from "@/utils/request.js"
import Qs from "qs"

export function c_individual_contract_work_report(values) {//分判商邀請函
    console.log(values);
    return request({
        url: "api/data?page=individual_contract_work_report&action=c_individual_contract_work_report",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function r_individual_contract_work_report(individual_contract_id) {//報價單
    return request({
        url: "api/data?page=individual_contract_work_report&action=r_individual_contract_work_report",
        method: "POST",
        data: Qs.stringify({
            individual_contract_id
        })
    })
}
export function u_individual_contract_work_report(values) {//報價單
    return request({
        url: "api/data?page=individual_contract_work_report&action=u_individual_contract_work_report",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function d_individual_contract_work_report(work_report_id) {//報價單
    return request({
        url: "api/data?page=individual_contract_work_report&action=d_individual_contract_work_report",
        method: "POST",
        data: Qs.stringify({
            work_report_id
        })
    })
}