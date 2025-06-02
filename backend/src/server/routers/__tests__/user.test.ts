import { inferProcedureInput } from '@trpc/server';
import { appRouter, type AppRouter } from '../_app';

describe('userRouter', () => {
  const caller = appRouter.createCaller({
    req: {},
    res: {},
  });

  test('getUser', async () => {
    const input: inferProcedureInput<AppRouter['user']['getUser']> = 'test-id';
    const user = await caller.user.getUser(input);
    
    expect(user).toMatchObject({
      id: input,
      email: expect.any(String),
      name: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  test('createUser', async () => {
    const input: inferProcedureInput<AppRouter['user']['createUser']> = {
      email: 'test@example.com',
      name: 'Test User',
    };
    
    const user = await caller.user.createUser(input);
    
    expect(user).toMatchObject({
      id: expect.any(String),
      email: input.email,
      name: input.name,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
}); 