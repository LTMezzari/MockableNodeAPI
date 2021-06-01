import ILog from "../ILog";
import IValidation from "../IValidation";

export default abstract class IRoute {
    path: string;
    method: string;
    name?: string;
    status?: number;
    response?: any;
    description?: string;
    queries?: any[];
    body?: any;
    timeOut?: number;
    authentication?: any = false;
    logs: ILog[] = [];
    validation?: IValidation;

    constructor(
        path: string,
        method: string,
        name?: string,
        description?: string,
        queries?: any[],
        response?: any,
        body?: any,
        status: number = 200,
        authentication: boolean = true,
        timeOut?: number,
        validation?: any
    ) {
        this.path = path;
        this.method = method;
        this.name = name;
        this.description = description;
        this.queries = queries;
        this.response = response;
        this.body = body;
        this.status = status;
        this.authentication = authentication;
        this.timeOut = timeOut;
        this.validation = validation;
    }
}