import ILog from "../ILog";

export default abstract class IRoute {
    path: string;
    method: string;
    status?: number;
    response?: any;
    description?: string;
    isActive: boolean = true;
    logs: ILog[] = [];

    constructor(path: string, method: string, description?: string, response?: any, status: number = 200) {
        this.path = path;
        this.method = method;
        this.description = description;
        this.response = response;
        this.status = status;
    }
}