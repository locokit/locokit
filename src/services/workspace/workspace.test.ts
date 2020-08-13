import app from '../../app';

describe('\'workspace\' service', () => {
  it('registered the service', () => {
    const service = app.service('workspace');
    expect(service).toBeTruthy();
  });

});
