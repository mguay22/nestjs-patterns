# Singleton

## Intent

Ensure a class has only one instance and provide a global point of access to it.

## Problem

In many applications, certain resources should exist exactly once: a configuration manager, a connection pool, or a logging service. If multiple instances of these services are created independently, they can fall out of sync, waste resources, or produce inconsistent behavior. For example, if two parts of your e-commerce application each create their own configuration service, one might cache stale database settings while the other has the latest values.

## Solution

The Singleton pattern restricts a class to a single instance and provides a well-known access point to that instance. In NestJS, this is the default behavior for all providers: when you register a service with `@Injectable()` and add it to a module's `providers` array, the framework creates exactly one instance and shares it across all consumers within that module's scope. Every controller or service that injects the same provider receives a reference to the same object in memory.

## Structure

- **Singleton (ConfigurationService):** The class that should only be instantiated once. It stores instance-specific state (here, an `instanceId` generated at construction time) and exposes methods to access shared data.
- **Clients (SingletonController):** Any class that depends on the Singleton. Multiple clients all receive the same instance via dependency injection.

The key insight is that the container (NestJS's IoC container) acts as the Singleton registry. You do not need to implement the classic `getInstance()` static method -- the framework handles it for you.

## E-Commerce Example

This implementation models a **store-wide configuration service** for an e-commerce platform. The `ConfigurationService` holds application configuration such as the database connection string and cache settings. It also generates a unique `instanceId` (UUID) at construction time, which serves as proof that only one instance exists.

Two separate controller routes (`GET /singleton` and `GET /singleton/other`) both inject the same `ConfigurationService`. When you call both endpoints, the returned `instanceId` is identical, demonstrating that NestJS reuses a single instance.

| Pattern Role | Implementation |
|---|---|
| Singleton | `ConfigurationService` |
| Client A | `SingletonController.getRoute1()` |
| Client B | `SingletonController.getRoute2()` |

## When to Use

- You need exactly one instance of a class to coordinate actions across the system (e.g., configuration, logging, metrics).
- The single instance must be accessible from multiple parts of the application without passing it around explicitly.
- Initialization is expensive and should happen only once (e.g., reading a config file, establishing a connection pool).
- You need a shared in-memory cache or state that all consumers must read from and write to consistently.

## When NOT to Use

- When each consumer needs its own isolated state. In NestJS, use `Scope.REQUEST` or `Scope.TRANSIENT` instead of the default singleton scope.
- When the shared state makes unit testing difficult. Singletons can introduce hidden coupling; if you find yourself resetting global state between tests, consider whether a narrower scope would be cleaner.
- When the class holds no state at all. A pure utility class with only static methods does not benefit from being a Singleton -- it is effectively stateless already.

## NestJS Integration

NestJS providers are singletons by default. When you declare a provider in `@Module({ providers: [ConfigurationService] })`, the framework creates one instance the first time it is injected and reuses it everywhere within that module (and any module that imports it).

This means the classic Singleton pattern is built into the framework. You do not need to write any boilerplate such as private constructors or static `getInstance()` methods. If you need to change the lifecycle, NestJS offers two other scopes:

- `Scope.REQUEST` -- a new instance per incoming request.
- `Scope.TRANSIENT` -- a new instance per injection point.

These are set via `@Injectable({ scope: Scope.REQUEST })`.

## API Endpoints

### GET /singleton

Returns the configuration from the first route handler.

```bash
curl http://localhost:3000/singleton
```

Expected response:

```json
{
  "source": "route1",
  "config": {
    "instanceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "database": "postgres://localhost:5432/nestjs_patterns",
    "cacheEnabled": true
  }
}
```

### GET /singleton/other

Returns the configuration from the second route handler. The `instanceId` will be identical to the one returned by `GET /singleton`, proving the same instance is shared.

```bash
curl http://localhost:3000/singleton/other
```

Expected response:

```json
{
  "source": "route2",
  "config": {
    "instanceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "database": "postgres://localhost:5432/nestjs_patterns",
    "cacheEnabled": true
  }
}
```

## Key Files

| File | Description |
|---|---|
| `configuration.service.ts` | The Singleton service that holds application configuration and a unique instance ID. |
| `singleton.controller.ts` | Controller with two routes that both inject the same `ConfigurationService` instance. |
| `singleton.module.ts` | NestJS module that registers the controller and provider. |

## Related Patterns

- **Abstract Factory, Builder, Prototype:** These patterns can all use Singleton internally to ensure that their factory or builder objects are created only once.
- **Facade:** A Facade is often implemented as a Singleton because the application typically needs only one entry point to a subsystem.
- **Flyweight:** Flyweight objects are often managed by a Singleton factory that serves as the central registry for shared instances.
