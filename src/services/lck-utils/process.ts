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
