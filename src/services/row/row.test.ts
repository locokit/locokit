import app from '../../app';

describe('\'row\' service', () => {
  it('registered the service', () => {
    const service = app.service('row');
    expect(service).toBeTruthy();
  });
});
