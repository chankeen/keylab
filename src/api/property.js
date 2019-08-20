import request from "@/utils/request.js"
import Qs from "qs"
export function get_property(admin_wp_id, property_id) {
    return request({
        url: "api/data?page=property&action=r_property",
        method: "POST",
        data: Qs.stringify({

        })
    });
}
export function update_pmaster(values) {
    return request({
        url: "admin-index?page=pmaster&action=update_pmaster",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    });
}
export function delete_property(property_id) {
    return request({
        url: "api/data?page=property&action=d_property",
        method: "POST",
        data: Qs.stringify({
            property_id
        })
    });
}
export function new_property(value) {
    return request({
        url: "api/data?page=property&action=c_property",
        method: "POST",
        data: Qs.stringify({
            ...value
        })
    });
}

export function get_sub_contractor() {
    return request({
        url: "admin-index?page=pmaster&action=get_sub_contractor",
        method: "POST",
        data: Qs.stringify({
        })
    });
}