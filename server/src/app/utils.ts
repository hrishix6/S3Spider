import { ZodError } from "zod";

export function formatZodErrors(error: ZodError) {
    const formattedErrors: Record<string, string> = {};

    let key;
    for (const issue of error.issues) {
        if (issue.path.length > 1) {
            key = issue.path.join(".");
        }
        else {
            key = `${issue.path[0]}`
        }

        formattedErrors[key] = issue.message;
    }

    return formattedErrors;
}