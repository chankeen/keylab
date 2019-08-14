import request from "@/utils/request.js"
import Qs from "qs"
export function get_pmasters() {
    return request({
        url: "admin-index?page=pmaster&action=get_pmasters",
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
export function delete_pmaster(pid) {
    return request({
        url: "admin-index?page=pmaster&action=delete_pmaster",
        method: "POST",
        data: Qs.stringify({
            pid
        })
    });
}
export function new_pmaster(value) {
    return request({
        url: "admin-index?page=pmaster&action=new_pmaster",
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