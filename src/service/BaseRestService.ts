import axios from 'axios';

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
