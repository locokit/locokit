export enum ProcessExecutionStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  RUNNING = 'RUNNING'
}

export enum ProcessTriggerEvent {
  MANUAL = 'MANUAL',
  CRON = 'CRON',
  CREATE_ROW = 'CREATE_ROW',
  UPDATE_ROW = 'UPDATE_ROW',
  UPDATE_ROW_DATA = 'UPDATE_ROW_DATA',
}

export interface LckProcessTriggerWithExecutions {
  id: string;
  text: string;
  setting: [];
  executions: {}[];
  createdAt: Date;
  updateAt: Date;
  process_id: string;
  table_id: string;
  enabled: boolean;
  event: ProcessTriggerEvent;
}

export interface LckProcessExecution {
  id: string;
  text: string;
  duration: number;
  log: string;
  setting: [];
  createdAt: Date;
  updateAt: Date;
  process_trigger_id: string;
  table_row_id: string;
  status: ProcessExecutionStatus;
}
