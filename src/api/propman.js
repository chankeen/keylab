import request from "@/utils/request.js"
import Qs from "qs"

export function get_propman() {
    return request({
        url: "api/data?page=propman&action=r_propman",
        method: "POST",
        data: Qs.stringify({

        })
    })
}
export function u_propman(values) {
    return request({
        url: "api/data?page=propman&action=u_propman",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}
export function c_propman(values) {
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

