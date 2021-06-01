import IRouteFactory from '../domain/factory/IRouteFactory';
import IRouteHandler from '../application/handler/IRouteHandler';
import IRouteRepository from '../domain/repository/IRouteRepository';
import IRouteExtractor from '../application/extractor/IRouteExtractor';
import IRouteAuthenticator from '../application/authenticator/IRouteAuthenticator';
import IRouteConverter from '../application/converter/IRouteConverter';
import IRouteValidator from '../application/validator/IRouteValidator';

import DefaultHandler from '../application/handler/DefaultHandler';
import DefaultRepository from '../domain/repository/DefaultRepository';
import DefaultFactory from '../domain/factory/DefaultFactory';
import DefaultExtractor from '../application/extractor/DefaultExtractor';
import DefaultAuthenticator from '../application/authenticator/DefaultAuthenticator';

class Configuration {
    factory: IRouteFactory;
    handler: IRouteHandler;
    repository: IRouteRepository;
    authenticator: IRouteAuthenticator;
    validator: IRouteValidator;
    extractors: IRouteExtractor[];
    converters: IRouteConverter[];

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
        this.configuration.converters = [];
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

    setValidator(validator: IRouteValidator): Builder {
        this.configuration.validator = validator;
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

    setConverters(converters: IRouteConverter[]): Builder {
        this.configuration.converters = converters;
        return this;
    }

    addConverter(converter: IRouteConverter): Builder {
        this.configuration.converters.push(converter);
        return this;
    }

    build(): Configuration {
        return this.configuration;
    }
}

export default Configuration;