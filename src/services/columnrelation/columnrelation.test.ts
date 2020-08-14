import app from '../../app';

describe('\'columnrelation\' service', () => {
  it('registered the service', () => {
    const service = app.service('columnrelation');
    expect(service).toBeTruthy();
  });
});
