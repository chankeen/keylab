import request from "@/utils/request.js"
import Qs from "qs"

export function r_oc(property_id) {
    return request({
        url: "api/data?page=oc&action=r_oc",
        method: "POST",
        data: Qs.stringify({
            property_id
        })
    })
}
export function u_oc(values) {
    return request({
        url: "api/data?page=oc&action=u_oc",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function c_oc(values) {
    return request({
        url: "api/data?page=oc&action=c_oc",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function d_oc(oc_id) {
    return request({
        url: "api/data?page=oc&action=d_oc",
        method: "POST",
        data: Qs.stringify({
            oc_id
        })
    })
}

