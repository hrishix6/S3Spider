import { z } from "zod";

export const ConfigModelSchema = z.object({
    s3xplorer_admin: z.string().min(1),
    s3xplorer_admin_pass: z.string().min(1),
    port: z.number().positive(),
    db_user: z.string().min(1),
    db_pass: z.string().min(1),
    db_host: z.string().min(1),
    db_port: z.number().positive(),
    db_name: z.string().min(1),
    env: z.string().min(1).optional(),
    jwt_secret: z.string().min(1),
    frontend_url: z.string().optional()
});

export type ConfigModel = z.infer<typeof ConfigModelSchema>;

export type EnvironmentVars = keyof ConfigModel;