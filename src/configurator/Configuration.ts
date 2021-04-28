import IRouteFactory from '../factory/IRouteFactory';
import IRouteHandler from '../handler/IRouteHandler';
import IRouteRepository from '../repository/IRouteRepository';

import DefaultHandler from '../handler/DefaultHandler';
import DefaultRepository from '../repository/DefaultRepository';
import DefaultFactory from '../factory/DefaultFactory';

class Configuration {
    factory: IRouteFactory;
    handler: IRouteHandler;
    repository: IRouteRepository;

    constructor() {}
}

export class Builder {
    configuration: Configuration;

    constructor() {
        this.configuration = new Configuration();
        this.configuration.handler = new DefaultHandler();
        this.configuration.repository = new DefaultRepository();
        this.configuration.factory = new DefaultFactory();
    }

    setFactory(factory: IRouteFactory): Builder {
        this.configuration.factory = factory;
        return this;
    }

    setHandler(handler: IRouteHandler): Builder {
        this.configuration.handler = handler;
        return this;
    }

    setRepository(repository: IRouteRepository): Builder {
        this.configuration.repository = repository;
        return this;
    }

    build(): Configuration {
        return this.configuration;
    }
}

export default Configuration;