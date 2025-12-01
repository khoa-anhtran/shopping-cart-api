export type MyRequest = Request & {
    user: ReqUserPayload
}

export type ReqUserPayload = {
    userId: string,
    email: string,
    token?: string,
    sub?: string,
    name?: string,
    tid?: string
}