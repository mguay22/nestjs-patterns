import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SingletonModule } from './patterns/creational/singleton/singleton.module';
import { FactoryMethodModule } from './patterns/creational/factory-method/factory-method.module';
import { AbstractFactoryModule } from './patterns/creational/abstract-factory/abstract-factory.module';
import { BuilderModule } from './patterns/creational/builder/builder.module';
import { PrototypeModule } from './patterns/creational/prototype/prototype.module';
import { AdapterModule } from './patterns/structural/adapter/adapter.module';
import { BridgeModule } from './patterns/structural/bridge/bridge.module';
import { CompositeModule } from './patterns/structural/composite/composite.module';
import { DecoratorModule } from './patterns/structural/decorator/decorator.module';
import { FacadeModule } from './patterns/structural/facade/facade.module';
import { FlyweightModule } from './patterns/structural/flyweight/flyweight.module';
import { ProxyModule } from './patterns/structural/proxy/proxy.module';
import { ChainOfResponsibilityModule } from './patterns/behavioral/chain-of-responsibility/chain-of-responsibility.module';
import { CommandModule } from './patterns/behavioral/command/command.module';
import { InterpreterModule } from './patterns/behavioral/interpreter/interpreter.module';
import { IteratorModule } from './patterns/behavioral/iterator/iterator.module';
import { MediatorModule } from './patterns/behavioral/mediator/mediator.module';
import { MementoModule } from './patterns/behavioral/memento/memento.module';
import { ObserverModule } from './patterns/behavioral/observer/observer.module';
import { StateModule } from './patterns/behavioral/state/state.module';
import { StrategyModule } from './patterns/behavioral/strategy/strategy.module';
import { TemplateMethodModule } from './patterns/behavioral/template-method/template-method.module';
import { VisitorModule } from './patterns/behavioral/visitor/visitor.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
