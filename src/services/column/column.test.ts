import app from '../../app';
import { COLUMN_TYPE } from '@locokit/lck-glossary';

describe('\'column\' service', () => {
  it('registered the service', () => {
    const service = app.service('column');
    expect(service).toBeTruthy();
  });

  it('create a column without error', async () => {
    expect.assertions(1);
    const service = app.service('column');
    const workspace = await app.service('workspace').create({text: 'pouet'})
    const database = await app.service('database').create({text: 'pouet', workspace_id: workspace.id})
    const table = await app.service('table').create({text: 'pouet', database_id: database.id})
    const tableColumn = await service.create({
      text: 'myColumn',
      table_id: table.id,
      column_type_id: COLUMN_TYPE.STRING
    })

    expect(tableColumn).toBeTruthy()
  });
});
