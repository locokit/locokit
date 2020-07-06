import app from '../../app';

describe('\'group\' service', () => {
  it('registered the service', () => {
    const service = app.service('group');
    expect(service).toBeTruthy();
  });
});
