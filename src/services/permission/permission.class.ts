import { Forbidden, NotAcceptable, NotFound } from '@feathersjs/errors'
import { Params, ServiceMethods } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Group } from '../../models/group.model'

export class Permission implements Partial<ServiceMethods<{}>> {
  app: Application

  constructor (app: Application) {
    this.app = app
  }

  async find (params?: Params): Promise<boolean> {
    /**
     * Decompose x-original-uri to get workspaceId & filename
     */
    const storagePublicPath = this.app.get('storage').publicPath
    const receivedPath = params?.headers?.['x-original-uri']
    const filePath = receivedPath.replace(storagePublicPath, '')
    const re = /\/(.*)\/(.*)/g
    const result = re.exec(filePath)
    if (!result) throw new NotAcceptable('File URL is malformed')
    const [, workspaceId, filename] = result

    /**
     * Get workspace with groups + users authorized
     */
    const workspace = await this.app.services.workspace.get(workspaceId, {
      query: {
        $eager: '[groups.users]',
      },
    })
    if (!workspace) throw new NotFound('Workspace not found')

    /**
     * Check if the current user is a member of at least a group
     */
    let userFound = false
    workspace.groups?.forEach((currentGroup: Group) => {
      currentGroup.users?.forEach(currentUser => {
        if (currentUser.id === params?.user.id) userFound = true
      })
    })
    if (!userFound) throw new Forbidden('You don\'t have sufficient right to access this file')

    /**
     * Check if the file really exist
     */
    const file = await this.app.services.attachment.find({
      query: {
        workspace_id: workspaceId,
        filename,
      },
    })
    if (file.total === 0) throw new NotFound('File not found')

    /**
     * All checks passed ! return true :-)
     */
    return true
  }
}
