import { JwtPayload, JwtPayloadSchema } from "./types";
import jwt from "jsonwebtoken";
import { formatZodErrors } from "../app/utils";
import { Service } from "typedi";

@Service()
export class JwtService {
    signToken(payload: JwtPayload, key: string) {
        return new Promise<string>((resolve, reject) => {
            jwt.sign(payload, key, { expiresIn: '5m' }, (error, token) => {
                if (error) {
                    reject(error);
                }
                if (token) {
                    resolve(token);
                }
                else {
                    reject(new Error("couldn't sign a token"));
                }
            });
        })
    }
    verifyToken(token: string, key: string) {
        return new Promise<JwtPayload>((resolve, reject) => {
            jwt.verify(token, key, {}, (error, decoded) => {

                if (error) {
                    reject(error);
                }

                const parseResult = JwtPayloadSchema.safeParse(decoded);
                if (parseResult.success) {
                    resolve(parseResult.data);
                }
                else {
                    reject(formatZodErrors(parseResult.error));
                }
            });
        });
    }
}