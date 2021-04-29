import IRoute from "../model/route/IRoute";

export default class IFactoryAdapter {
    createRoute: (request: any) => IRoute | undefined;

    createRoutes: (request: any) => IRoute[] | undefined;
}