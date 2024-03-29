import type SCOPED_SERVICE from '../enums/scoped-service';
import type SINGLETON_SERVICE from '../enums/singleton-service';
import type IAuthenticationService from '../service/authentication-service';
import type IExpressService from '../service/express-service';
import type IDataContextService from '../service/data-context-service';
import type IMediatorService from '../service/mediator-service';
import type IConfigurationService from '../service/configuration-service';
import type ILoggerService from '../service/logger-service';
import type IAuthorizationService from '../service/authorization-service';
import type IExpressErrorHandlerService from '../service/express-error-handler-service';
import type ITokenService from '../service/token-service';
import type ISchemaParserService from '../service/schema-parser-service';
import type IVersioningService from '../service/versioning-service';
import type { Constructor } from '../types';

type KnownSingletonService<TKey, TIsRegister> = TKey extends typeof SINGLETON_SERVICE.EXPRESS
    ? TIsRegister extends true
        ? Constructor<IExpressService>
        : IExpressService
    : TKey extends typeof SINGLETON_SERVICE.DATA_CONTEXT
    ? TIsRegister extends true
        ? Constructor<IDataContextService>
        : IDataContextService
    : TKey extends typeof SINGLETON_SERVICE.MEDIATOR
    ? TIsRegister extends true
        ? Constructor<IMediatorService>
        : IMediatorService
    : TKey extends typeof SINGLETON_SERVICE.CONFIGURATION
    ? TIsRegister extends true
        ? Constructor<IConfigurationService>
        : IConfigurationService
    : TKey extends typeof SINGLETON_SERVICE.LOGGER
    ? TIsRegister extends true
        ? Constructor<ILoggerService>
        : ILoggerService
    : TKey extends typeof SINGLETON_SERVICE.ERROR_HANDLER
    ? TIsRegister extends true
        ? Constructor<IExpressErrorHandlerService>
        : IExpressErrorHandlerService
    : TKey extends typeof SINGLETON_SERVICE.SCHEMA_PARSER
    ? TIsRegister extends true
        ? Constructor<ISchemaParserService>
        : ISchemaParserService
    : TKey extends typeof SINGLETON_SERVICE.TOKEN
    ? TIsRegister extends true
        ? Constructor<ITokenService>
        : ITokenService
    : TKey extends typeof SINGLETON_SERVICE.VERSIONING
    ? TIsRegister extends true
        ? Constructor<IVersioningService>
        : IVersioningService
    : null;

type KnownScopedService<TKey> = TKey extends typeof SCOPED_SERVICE.AUTHORIZATION
    ? Constructor<IAuthorizationService>
    : TKey extends typeof SCOPED_SERVICE.AUTHENTICATION
    ? Constructor<IAuthenticationService>
    : null;

export type SingletonServiceResult<TService, TKey, TIsRegister = false> = KnownSingletonService<
    TKey,
    TIsRegister
> extends null
    ? TService
    : KnownSingletonService<TKey, TIsRegister>;

export type ScopedServiceResult<TService, TKey> = KnownScopedService<TKey> extends null
    ? TService
    : KnownScopedService<TKey>;
