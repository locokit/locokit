import { realpath, stat } from 'node:fs/promises'
import { join } from 'node:path'

import { WorkspaceResult } from '@/services/core/workspace/workspace.schema'

/**
 * Check a filepath exist
 */
export async function checkFilepath(filepath: string, workspace: WorkspaceResult) {
  const workflowPath = await realpath(join('./workflows/', workspace.slug, filepath))
  const workflowStats = await stat(workflowPath)
  if (!workflowStats.isFile()) throw new Error('Workflow is not a file.')
}
