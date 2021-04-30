import IRouteFactory from '../factory/IRouteFactory';
import IRouteHandler from '../handler/IRouteHandler';
import IRouteRepository from '../repository/IRouteRepository';
import IRouteExtractor from '../extractor/IRouteExtractor';
import IRouteAuthenticator from '../authenticator/IRouteAuthenticator';

import DefaultHandler from '../handler/DefaultHandler';
import DefaultRepository from '../repository/DefaultRepository';
import DefaultFactory from '../factory/DefaultFactory';
import DefaultExtractor from '../extractor/DefaultExtractor';
import DefaultAuthenticator from '../authenticator/DefaultAuthenticator';

class Configuration {
    factory: IRouteFactory;
    handler: IRouteHandler;
    repository: IRouteRepository;
    authenticator: IRouteAuthenticator;
    extractors: IRouteExtractor[];

    constructor() {}
}

export class Builder {
    configuration: Configuration;

    constructor() {
        this.configuration = new Configuration();
        this.configuration.handler = new DefaultHandler();
        this.configuration.repository = new DefaultRepository();
        this.configuration.factory = new DefaultFactory();
        this.configuration.authenticator = new DefaultAuthenticator();
        this.configuration.extractors = [new DefaultExtractor()];
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

    setAuthenticator(authenticator: IRouteAuthenticator): Builder {
        this.configuration.authenticator = authenticator;
        return this;
    }

    setExtractors(extractors: IRouteExtractor[]): Builder {
        this.configuration.extractors = extractors;
        return this;
    }

    addExtractor(extractor: IRouteExtractor): Builder {
        this.configuration.extractors.push(extractor);
        return this;
    }

    build(): Configuration {
        return this.configuration;
    }
}

export default Configuration;