import app from '../../src/app';

describe('\'view\' service', () => {
  it('registered the service', () => {
    const service = app.service('view');
    expect(service).toBeTruthy();
  });
});
