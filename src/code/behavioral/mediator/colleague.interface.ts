import { Mediator } from './mediator.interface';

export abstract class Colleague {
  protected mediator!: Mediator;

  setMediator(mediator: Mediator): void {
    this.mediator = mediator;
  }

  abstract getName(): string;
}
