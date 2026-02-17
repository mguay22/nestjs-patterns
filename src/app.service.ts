import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getPatternIndex() {
    return {
      title: 'Gang of Four Design Patterns in NestJS',
      description:
        'All 23 classic GoF design patterns implemented idiomatically in NestJS using a unified e-commerce domain.',
      patterns: {
        creational: [
          {
            name: '1. Singleton',
            endpoints: ['GET /singleton', 'GET /singleton/other'],
            description:
              'Ensure a class has only one instance. Demonstrates NestJS default singleton scope.',
          },
          {
            name: '2. Factory Method',
            endpoints: ['POST /factory-method/products'],
            description:
              'Define an interface for creating objects, let subclasses decide which class to instantiate.',
          },
          {
            name: '3. Abstract Factory',
            endpoints: ['POST /abstract-factory/checkout'],
            description:
              'Create families of related objects without specifying concrete classes.',
          },
          {
            name: '4. Builder',
            endpoints: ['POST /builder/orders'],
            description: 'Construct complex objects step by step.',
          },
          {
            name: '5. Prototype',
            endpoints: [
              'GET /prototype/templates',
              'POST /prototype/products/clone/:id',
            ],
            description:
              'Create objects by cloning an existing instance.',
          },
        ],
        structural: [
          {
            name: '6. Adapter',
            endpoints: ['POST /adapter/payments'],
            description:
              'Convert one interface to another that clients expect.',
          },
          {
            name: '7. Bridge',
            endpoints: ['POST /bridge/notifications'],
            description:
              'Separate abstraction from implementation so both can vary independently.',
          },
          {
            name: '8. Composite',
            endpoints: ['GET /composite/catalog'],
            description:
              'Compose objects into tree structures to represent part-whole hierarchies.',
          },
          {
            name: '9. Decorator',
            endpoints: ['POST /decorator/orders/process'],
            description:
              'Attach additional responsibilities to objects dynamically.',
          },
          {
            name: '10. Facade',
            endpoints: ['POST /facade/place-order'],
            description:
              'Provide a simplified interface to a complex subsystem.',
          },
          {
            name: '11. Flyweight',
            endpoints: ['GET /flyweight/products'],
            description:
              'Share common state to support large numbers of fine-grained objects.',
          },
          {
            name: '12. Proxy',
            endpoints: ['GET /proxy/products', 'GET /proxy/products/:id'],
            description:
              'Provide a surrogate to control access to another object.',
          },
        ],
        behavioral: [
          {
            name: '13. Chain of Responsibility',
            endpoints: ['POST /chain/orders/validate'],
            description: 'Pass request along a chain of handlers.',
          },
          {
            name: '14. Command',
            endpoints: [
              'POST /command/orders/:action',
              'POST /command/orders/undo',
              'GET /command/orders/history',
            ],
            description:
              'Encapsulate requests as objects, supporting undo.',
          },
          {
            name: '15. Interpreter',
            endpoints: ['POST /interpreter/discounts/evaluate'],
            description:
              'Define a grammar and interpret sentences in that language.',
          },
          {
            name: '16. Iterator',
            endpoints: ['GET /iterator/products'],
            description:
              'Provide a way to access elements sequentially without exposing underlying representation.',
          },
          {
            name: '17. Mediator',
            endpoints: ['POST /mediator/orders'],
            description:
              'Define an object that encapsulates how a set of objects interact.',
          },
          {
            name: '18. Memento',
            endpoints: [
              'GET /memento/cart',
              'POST /memento/cart/add',
              'POST /memento/cart/undo',
              'POST /memento/cart/redo',
              'GET /memento/cart/history',
            ],
            description:
              "Capture and restore an object's internal state.",
          },
          {
            name: '19. Observer',
            endpoints: ['POST /observer/orders'],
            description:
              'Define a one-to-many dependency; when one changes, all dependents are notified.',
          },
          {
            name: '20. State',
            endpoints: [
              'POST /state/orders',
              'GET /state/orders/:id',
              'POST /state/orders/:id/:action',
            ],
            description:
              'Allow an object to alter its behavior when its internal state changes.',
          },
          {
            name: '21. Strategy',
            endpoints: ['POST /strategy/pricing'],
            description:
              'Define a family of interchangeable algorithms.',
          },
          {
            name: '22. Template Method',
            endpoints: ['GET /template-method/reports/:type'],
            description:
              'Define the skeleton of an algorithm, letting subclasses override specific steps.',
          },
          {
            name: '23. Visitor',
            endpoints: ['POST /visitor/orders/analyze'],
            description:
              'Add operations to objects without modifying them.',
          },
        ],
      },
    };
  }
}
