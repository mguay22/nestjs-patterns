import { Injectable } from '@nestjs/common';
import { Command, CommandResult } from './command.interface.js';

export interface HistoryEntry {
  commandName: string;
  action: 'execute' | 'undo';
  result: CommandResult;
  timestamp: string;
}

@Injectable()
export class OrderCommandInvokerService {
  private readonly executedCommands: Command[] = [];
  private readonly history: HistoryEntry[] = [];

  executeCommand(command: Command): CommandResult {
    const result = command.execute();

    if (result.success) {
      this.executedCommands.push(command);
    }

    this.history.push({
      commandName: command.name,
      action: 'execute',
      result,
      timestamp: new Date().toISOString(),
    });

    return result;
  }

  undoLastCommand(): CommandResult {
    const command = this.executedCommands.pop();

    if (!command) {
      return {
        success: false,
        message: 'No commands to undo',
      };
    }

    const result = command.undo();

    this.history.push({
      commandName: command.name,
      action: 'undo',
      result,
      timestamp: new Date().toISOString(),
    });

    return result;
  }

  getHistory(): HistoryEntry[] {
    return [...this.history];
  }
}
