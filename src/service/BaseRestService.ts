import axios from 'axios';

export async function getRequestWithHeaders<T>(link: string, headers: object): Promise<T> {
    return getRequest<T>(link, headers)
}

export async function getRequest<T>(link: string, headers?: object): Promise<T> {
    try {
        let config = {};

        if (headers) {
            config = {
                ...config,
                "headers": headers
            }
        }

        const response = await axios.get<T>(link, config);
        console.log("BaseRestService get", response);
        return response.data;
    } catch (ex) {
        console.error("BaseRestService get error", ex)
        throw Error("BaseRestService get error")
    }
}

export async function postRequestWithHeaders<T>(link: string, headers: object): Promise<T> {
    return postRequest<T>(link, undefined, headers)
}

export async function postRequestWithParams<T>(link: string, params: object): Promise<T> {
    return postRequest<T>(link, params, undefined)
}

export async function postRequest<T>(link: string, params?: object, headers?: object): Promise<T> {
    try {
        let config = {};

        if (headers) {
            config = {
                ...config,
                "headers": headers
            }
        }

        if (params) {
            let body = "{}"
            try {
                body = JSON.stringify(params)
            } catch (ex) {
                throw Error("BaseRestService post conver JSON issue")
            }
            config = {
                ...config,
                "params": body
            }
        }

        const response = await axios.post<T>(link, config);
        console.log("BaseRestService post", response);
        return response.data;
    } catch (ex) {
        console.error("BaseRestService post error", ex)
        throw Error("BaseRestService post error")
    }
}
