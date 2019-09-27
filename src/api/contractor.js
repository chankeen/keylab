import request from "@/utils/request.js"
import Qs from "qs"

export function r_contractor(property_id) {
    return request({
        url: "api/data?page=contractor&action=r_contractor",
        method: "POST",
        data: Qs.stringify({
            property_id
        })
    })
}
export function u_contractor(values) {
    console.log(values);
    return request({
        url: "api/data?page=contractor&action=u_contractor",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function c_contractor(values) {
    console.log(values);
    return request({
        url: "api/data?page=contractor&action=c_contractor",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function d_contractor(contractor_id) {
    return request({
        url: "api/data?page=contractor&action=d_contractor",
        method: "POST",
        data: Qs.stringify({
            contractor_id
        })
    })
}

