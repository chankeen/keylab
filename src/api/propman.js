import request from "@/utils/request.js"
import Qs from "qs"

export function r_propman(property_id) {
    return request({
        url: "api/data?page=propman&action=r_propman",
        method: "POST",
        data: Qs.stringify({
            property_id
        })
    })
}
export function u_propman(values) {
    console.log(values);
    return request({
        url: "api/data?page=propman&action=u_propman",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function c_propman(values) {
    console.log(values);
    return request({
        url: "api/data?page=propman&action=c_propman",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function d_propman(propman_id) {
    return request({
        url: "api/data?page=propman&action=d_propman",
        method: "POST",
        data: Qs.stringify({
            propman_id
        })
    })
}

