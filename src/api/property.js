import request from "@/utils/request.js"
import Qs from "qs"
export function r_property(admin_wp_id, property_id) {
    return request({
        url: "api/data?page=property&action=r_property",
        method: "POST",
        data: Qs.stringify({
            property_id,
            admin_wp_id
        })
    });
}
export function u_property(values) {
    return request({
        url: "api/data?page=property&action=u_property",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    });
}
export function d_property(property_id) {
    return request({
        url: "api/data?page=property&action=d_property",
        method: "POST",
        data: Qs.stringify({
            property_id
        })
    });
}
export function c_property(value) {
    return request({
        url: "api/data?page=property&action=c_property",
        method: "POST",
        data: Qs.stringify({
            ...value
        })
    });
}