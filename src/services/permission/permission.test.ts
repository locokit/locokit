import app from '../../app';

describe('\'permission\' service', () => {
  it('registered the service', () => {
    const service = app.service('permission');
    expect(service).toBeTruthy();
  });
});
