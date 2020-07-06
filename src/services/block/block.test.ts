import app from '../../app';

describe('\'block\' service', () => {
  it('registered the service', () => {
    const service = app.service('block');
    expect(service).toBeTruthy();
  });
});
