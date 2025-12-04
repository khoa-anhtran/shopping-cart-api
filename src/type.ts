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

export type IModelConnection<M> = {
    edges: Edge<M>[];
    pageInfo: PageInfo;
}

export type PageInfo = {
    startCursor: string | null;
    endCursor: string | null;
    hasNextPage: Boolean;
};

export type Edge<M> = {
    node: M;
    cursor: string;
};