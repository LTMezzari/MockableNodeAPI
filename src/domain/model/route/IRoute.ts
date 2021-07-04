import ILog from "../ILog";
import IValidation from "../IValidation";

export default interface IRoute {
    path: string;
    method: string;
    name?: string;
    status?: number;
    response?: any;
    description?: string;
    queries?: any[];
    body?: any;
    timeOut?: number;
    authentication?: any;
    logs: ILog[];
    validation?: IValidation;
}