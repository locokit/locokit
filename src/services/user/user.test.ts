import app from '../../app';

describe('\'user\' service', () => {
  it('registered the service', () => {
    const service = app.service('user');
    expect(service).toBeTruthy();
  });
  it('forbid access to users if not authenticated', async () => {
    const response = await app.service('user').find()
  })
});
