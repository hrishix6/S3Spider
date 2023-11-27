import { z } from "zod";
import { IdParseSchema } from "../app/types";

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

export const UpdateUserInfo = z.object({
    id: IdParseSchema,
    verified: z.boolean(),
    role: z.enum(["admin", "user", "viewer"])
});

export type UpdateUserDto = z.infer<typeof UpdateUserInfo>;

export const UpdateUsersRequest = z.object({ payload: z.array(UpdateUserInfo) });

export type UpdateUsers = z.infer<typeof UpdateUsersRequest>;

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;


export const JwtPayloadSchema = z.object({
    id: z.coerce.number().safe().nonnegative()
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

export const UpdatedUserAccount = z.object({
    id: IdParseSchema,
    name: z.string().optional(),
    aws_id: z.string().optional(),
    assigned: z.boolean()
});

export type UpdatedUserAccounts = z.infer<typeof UpdatedUserAccount>;

export const UpdateUserAccountsRequest = z.object({
    accounts: z.array(UpdatedUserAccount)
});
