export function isNullOrEmpty(value: any) {
    return (!value || value.toString() === "")
}


export function IsNullOrWhiteSpace(value: any) {
    return isNullOrEmpty(value) || value.match(/^ *$/) !== null;
}

export function isObject(obj: any) {
    let type = typeof obj;
    return (type === 'object' && !!obj);
}

export function isBoolean(obj: any) {
    return typeof obj == "boolean";
}

export function getWebApiUrl(): string {
    if (process.env.NODE_ENV === 'production') {
        return "https://drincs-website-back-end.onrender.com"
    }
    else {
        return "https://localhost:7289"
    }
}

export function getClientUrl(): string {
    if (process.env.NODE_ENV === 'production') {
        return "https://drincs-website.web.app"
    }
    else {
        return "http://localhost:3005"
    }
}
