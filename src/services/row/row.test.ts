import { COLUMN_TYPE } from '@locokit/lck-glossary';
import app from '../../app';
import { row } from '../../models/row.model';

describe('\'row\' service', () => {
  it('registered the service', () => {
    const service = app.service('row');
    expect(service).toBeTruthy();
  });

  it('throw if table_id is not present', async () => {
    const service = app.service('row');
    expect.assertions(1);
    await expect(service.create({
      text: 'test',
    })).rejects.toThrow()
  })
  it('throw if table_id is present but did not exist', async () => {
    const service = app.service('row');
    expect.assertions(1);
    await expect(service.create({
      text: 'test',
      table_id: 'you lose'
    })).rejects.toThrow()
  })
  it('succeed if table_id is present and exist', async () => {
    const service = app.service('row');
    const workspace = await app.service('workspace').create({text: 'pouet'})
    const database = await app.service('database').create({text: 'pouet', workspace_id: workspace.id})
    const table = await app.service('table').create({text: 'pouet', database_id: database.id})
    expect.assertions(1);
    const row = await service.create({
      text: 'test',
      table_id: table.id
    })
    expect(row).toBeTruthy()
  })

  it('patch only the "text" property when patching "text" (bug of crush "data" property)', async () => {
    const service = app.service('row');
    const workspace = await app.service('workspace').create({text: 'pouet'})
    const database = await app.service('database').create({text: 'pouet', workspace_id: workspace.id})
    const table = await app.service('table').create({text: 'pouet', database_id: database.id})
    const tableColumn = await app.service('column').create({
      text: 'myColumn',
      table_id: table.id,
      column_type_id: COLUMN_TYPE.STRING
    })
    const currentRow: row = await service.create({
      text: 'test',
      data: {
        [tableColumn.id]: 'myValue'
      },
      table_id: table.id
    })
    const patchedRow: row = await service.patch(currentRow.id, {
      text: 'new test'
    })
    expect(patchedRow.text).toEqual('new test');
    expect(patchedRow.data[tableColumn.id]).toEqual('myValue');
  });
});
