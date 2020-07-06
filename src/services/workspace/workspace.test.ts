import app from '../../app';

describe('\'workspace\' service', () => {
  it('registered the service', () => {
    const service = app.service('workspace');
    expect(service).toBeTruthy();
  });

  it('return the workspace available for the current authenticated user', () => {

  })

  it('')
});
