import app from '../../app';

describe('\'workspace\' service', () => {
  it('registered the service', () => {
    const service = app.service('workspace');
    expect(service).toBeTruthy();
  });

  it('can create a workspace', async () => {
    const service = app.service('workspace');
    const newWorkspace = await service.create({
      text: 'testWorkspace'
    })
    expect(newWorkspace).toBeTruthy()
  })

});
