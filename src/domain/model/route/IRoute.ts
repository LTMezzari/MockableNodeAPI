import ILog from "../ILog";

export default abstract class IRoute {
    path: string;
    method: string;
    status?: number;
    response?: any;
    description?: string;
    queries?: any[];
    body?: any;
    timeOut?: number;
    needsAuthentication: boolean = false;
    logs: ILog[] = [];

    constructor(
        path: string,
        method: string,
        description?: string,
        queries?: any[],
        response?: any,
        body?: any,
        status: number = 200,
        needsAuthentication: boolean = true,
        timeOut?: number
    ) {
        this.path = path;
        this.method = method;
        this.description = description;
        this.queries = queries;
        this.response = response;
        this.body = body;
        this.status = status;
        this.needsAuthentication = needsAuthentication;
        this.timeOut = timeOut;
    }
}