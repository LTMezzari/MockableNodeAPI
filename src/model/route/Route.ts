import IRoute from './IRoute';

export default class Route extends IRoute {
    id: number;

    constructor(id: number, path: string, method: string, description?: string, response?: any, status: number = 200) {
        super(path, method, description, response, status);
        this.id = id;
    }
}