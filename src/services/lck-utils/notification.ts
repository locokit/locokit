interface CellState {
  rowId: null|string;
  columnId: null|string;
  waiting: boolean;
  isValid: null|boolean;
}

/**
 * Return a class to notify the saving state to the user.
 */
export function getCellStateNotificationClass (rowId: string, columnId: string, cellState: CellState) {
  if (cellState.rowId === rowId && cellState.columnId === columnId) {
    let notif = ''
    if (cellState.waiting) notif = 'saving '
    if (!cellState.waiting) notif = 'saved '
    if (cellState.isValid) notif += 'valid'
    if (!cellState.isValid) notif += 'error'
    return notif
  }
  return null
}

export default {
  getCellStateNotificationClass
}
