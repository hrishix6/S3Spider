import { z } from "zod";

const usernameSchema = z.string()
    .min(1, { message: "username or email cannot be empty" })
    .max(100, { message: "username or email cannot be longer than 100 characters" });

const passSchema = z.string()
    .min(1, { message: "password cannot be empty" })

export const LoginRequestSchema = z.object({
    username: usernameSchema,
    password: passSchema
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const RegisterRequestSchema = z.object({
    email: z.string().email().optional(),
    password: passSchema,
    username: usernameSchema
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;


export const JwtPayloadSchema = z.object({
    id: z.coerce.number().safe().nonnegative()
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;