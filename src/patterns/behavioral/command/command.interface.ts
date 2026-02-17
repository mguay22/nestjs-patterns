export interface CommandResult {
  success: boolean;
  message: string;
  data?: Record<string, any>;
}

export interface Command {
  readonly name: string;
  execute(): CommandResult;
  undo(): CommandResult;
}
