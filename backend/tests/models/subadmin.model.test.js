const mongoose = require('mongoose');

describe('SubAdmin Model Basic Validation', () => {
  test('should error when required fields missing', async () => {
    const sub = new SubAdmin({});
    let err;
    try {
      await sub.validate();
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
  // 'sport' won't error because schema supplies default 'cricket'
  expect(Object.keys(err.errors)).toEqual(expect.arrayContaining(['name','email','password','joinedDate']));
  });

  test('should create a valid subadmin (not saved)', async () => {
    const sub = new SubAdmin({
      name: 'Test User',
      email: 'test@example.com',
      password: '12345678',
      sport: 'cricket',
      joinedDate: new Date().toISOString().split('T')[0]
    });
    await expect(sub.validate()).resolves.toBeUndefined();
    expect(sub.status).toBe('Active');
  });
});
