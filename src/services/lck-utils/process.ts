export enum ProcessRunStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  RUNNING = 'RUNNING'
}

export enum ProcessEvent {
  MANUAL = 'MANUAL',
  CRON = 'CRON',
  CREATE_ROW = 'CREATE_ROW',
  UPDATE_ROW = 'UPDATE_ROW',
  UPDATE_ROW_DATA = 'UPDATE_ROW_DATA',
}

export interface LckProcessWithRuns {
  id: string;
  text: string;
  setting: [];
  createdAt: Date;
  updateAt: Date;
  table_id: string;
  url: string;
  enabled: boolean;
  trigger: ProcessEvent;
  maximumNumberSuccess: number;
  runs: LckProcessRun[];
}

export interface LckProcessRun {
  id: string;
  text: string;
  duration: number;
  log: string;
  setting: [];
  createdAt: Date;
  updateAt: Date;
  process_id: string;
  table_row_id: string;
  status: ProcessRunStatus;
}

export function getDisabledProcessTrigger (process: LckProcessWithRuns, rowId: string) {
  if (process.runs && process.runs.length > 0) {
    const res = process.runs.filter(run => rowId === run.table_row_id && run.status === ProcessRunStatus.SUCCESS)
    return res.length === process.maximumNumberSuccess
  }
  return false
}
