import request from "@/utils/request.js"
import Qs from "qs"
export function get_oc() {
    return request({
        url: "api/data?page=oc&action=r_oc",
        method: "POST",
        data: Qs.stringify({
            
        })
    })
}

