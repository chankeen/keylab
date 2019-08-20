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

