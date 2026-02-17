import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { SingletonModule } from './patterns/creational/singleton/singleton.module.js';
import { FactoryMethodModule } from './patterns/creational/factory-method/factory-method.module.js';
import { AbstractFactoryModule } from './patterns/creational/abstract-factory/abstract-factory.module.js';
import { BuilderModule } from './patterns/creational/builder/builder.module.js';
import { PrototypeModule } from './patterns/creational/prototype/prototype.module.js';
import { AdapterModule } from './patterns/structural/adapter/adapter.module.js';
import { BridgeModule } from './patterns/structural/bridge/bridge.module.js';
import { CompositeModule } from './patterns/structural/composite/composite.module.js';
import { DecoratorModule } from './patterns/structural/decorator/decorator.module.js';
import { FacadeModule } from './patterns/structural/facade/facade.module.js';
import { FlyweightModule } from './patterns/structural/flyweight/flyweight.module.js';
import { ProxyModule } from './patterns/structural/proxy/proxy.module.js';
import { ChainOfResponsibilityModule } from './patterns/behavioral/chain-of-responsibility/chain-of-responsibility.module.js';
import { CommandModule } from './patterns/behavioral/command/command.module.js';
import { InterpreterModule } from './patterns/behavioral/interpreter/interpreter.module.js';
import { IteratorModule } from './patterns/behavioral/iterator/iterator.module.js';
import { MediatorModule } from './patterns/behavioral/mediator/mediator.module.js';
import { MementoModule } from './patterns/behavioral/memento/memento.module.js';
import { ObserverModule } from './patterns/behavioral/observer/observer.module.js';
import { StateModule } from './patterns/behavioral/state/state.module.js';
import { StrategyModule } from './patterns/behavioral/strategy/strategy.module.js';
import { TemplateMethodModule } from './patterns/behavioral/template-method/template-method.module.js';
import { VisitorModule } from './patterns/behavioral/visitor/visitor.module.js';

@Module({
  imports: [
    SingletonModule,
    FactoryMethodModule,
    AbstractFactoryModule,
    BuilderModule,
    PrototypeModule,
    AdapterModule,
    BridgeModule,
    CompositeModule,
    DecoratorModule,
    FacadeModule,
    FlyweightModule,
    ProxyModule,
    ChainOfResponsibilityModule,
    CommandModule,
    InterpreterModule,
    IteratorModule,
    MediatorModule,
    MementoModule,
    ObserverModule,
    StateModule,
    StrategyModule,
    TemplateMethodModule,
    VisitorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
