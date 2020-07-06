import app from '../../app';

describe('\'chapter\' service', () => {
  it('registered the service', () => {
    const service = app.service('chapter');
    expect(service).toBeTruthy();
  });
});
