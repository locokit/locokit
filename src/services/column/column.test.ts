import app from '../../app';

describe('\'column\' service', () => {
  it('registered the service', () => {
    const service = app.service('column');
    expect(service).toBeTruthy();
  });
});
