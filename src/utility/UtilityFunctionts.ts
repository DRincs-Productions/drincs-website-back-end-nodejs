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

export function getDefaultUserIcon(): string {
    return "https://firebasestorage.googleapis.com/v0/b/drincs-website.appspot.com/o/public%2Ficon_user.png?alt=media"
}

export function getOAuthDiscordCallback(): string {
    if (process.env.NODE_ENV === 'production') {
        return "https://discord.com/api/oauth2/authorize?client_id=955048685056692307&redirect_uri=https%3A%2F%2Fdrincs-website-back-end.onrender.com%2Fauth%2FOAuthDiscordCallback&response_type=code&scope=identify%20email"
    }
    else {
        return "https://discord.com/api/oauth2/authorize?client_id=955048685056692307&redirect_uri=https%3A%2F%2Flocalhost%3A7127%2Fauth%2FOAuthDiscordCallback&response_type=code&scope=identify%20email"
    }
}
