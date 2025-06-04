"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
exports.userRouter = (0, trpc_1.router)({
    getUser: trpc_1.publicProcedure
        .input(zod_1.z.string())
        .query(async ({ input }) => {
        // This is a mock implementation
        return {
            id: input,
            email: 'user@example.com',
            name: 'John Doe',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }),
    createUser: trpc_1.publicProcedure
        .input(zod_1.z.object({
        email: zod_1.z.string().email(),
        name: zod_1.z.string().min(2),
    }))
        .mutation(async ({ input }) => {
        // This is a mock implementation
        const user = {
            id: Math.random().toString(36).substring(7),
            email: input.email,
            name: input.name,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return user;
    }),
});
