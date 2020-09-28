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

  it('paginate results by default to 10', async () => {
    expect.assertions(2);
    const service = app.service('column');
    const columns: any = await service.find()
    expect(columns.total).toBeDefined()
    expect(columns.limit).toBe(10)
  });

  it('discard pagination when table_id is set in query param and $limit is -1', async () => {
    expect.assertions(5);
    const service = app.service('column');
    const workspace = await app.service('workspace').create({text: 'pouet'})
    const database = await app.service('database').create({text: 'pouet', workspace_id: workspace.id})
    const table = await app.service('table').create({text: 'pouet', database_id: database.id})
    const column1 = await service.create({
      text: 'myColumn1',
      table_id: table.id,
      column_type_id: COLUMN_TYPE.STRING
    })
    const column2 = await service.create({
      text: 'myColumn2',
      table_id: table.id,
      column_type_id: COLUMN_TYPE.STRING
    })

    const columns: any = await service.find({
      query: {
        table_id: table.id,
        $limit: -1
      }
    })
    expect(columns.total).not.toBeDefined()
    expect(columns.limit).not.toBeDefined()
    expect(columns.length).toBe(2)
    expect(columns[0].id).toBe(column1.id)
    expect(columns[1].id).toBe(column2.id)
  });
});
