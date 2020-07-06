import app from '../../app';

describe('\'section\' service', () => {
  it('registered the service', () => {
    const service = app.service('section');
    expect(service).toBeTruthy();
  });
});
