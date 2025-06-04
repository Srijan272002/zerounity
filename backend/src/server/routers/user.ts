import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { User } from '../../types/shared';

export const userRouter = router({
  getUser: publicProcedure
    .input(z.string())
    .query(async ({ input }): Promise<User> => {
      // This is a mock implementation
      return {
        id: input,
        email: 'user@example.com',
        name: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),

  createUser: publicProcedure
    .input(z.object({
      email: z.string().email(),
      name: z.string().min(2),
    }))
    .mutation(async ({ input }) => {
      // This is a mock implementation
      const user: User = {
        id: Math.random().toString(36).substring(7),
        email: input.email,
        name: input.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return user;
    }),
}); 