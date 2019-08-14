import request from "@/utils/request.js"
import Qs from 'qs'

export function get_client_data() {
    return request({
        url: "admin-index?page=client_data&action=get_client_data",
        method: "post",
        data: Qs.stringify({
        })
    })
}
export function new_client_data(values) {
    return request({
        url: "admin-index?page=client_data&action=new_client_data",
        method: "post",
        data: Qs.stringify({
            ...values
        })
    })
}
export function update_client_data(values) {
    return request({
        url: "admin-index?page=client_data&action=update_client_data",
        method: "post",
        data: Qs.stringify({
            ...values
        })
    })
}
export function delete_client_data(cid) {
    return request({
        url: "admin-index?page=client_data&action=delete_client_data",
        method: "post",
        data: Qs.stringify({
            cid
        })
    })
}