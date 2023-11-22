import { z } from "zod";

const usernameSchema = z.string()
    .min(1, { message: "email should be a valid address" })
    .max(10, { message: "username cannot be longer than 10 characters" });

const passSchema = z.string()
    .min(5, { message: "password must be atleast 6 characters long" })

export const LoginRequestSchema = z.object({
    username: usernameSchema,
    password: passSchema
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const RegisterRequestSchema = z.object({
    password: passSchema,
    username: usernameSchema
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;


export const JwtPayloadSchema = z.object({
    id: z.coerce.number().safe().nonnegative()
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;