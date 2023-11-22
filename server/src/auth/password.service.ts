import argon2 from "argon2";

export interface IPasswordService {
    hash(pw: string): Promise<string>,
    compare(pw: string, hash: string): Promise<boolean>
}

export class PasswordService implements IPasswordService {

    async hash(pw: string): Promise<string> {
        return argon2.hash(pw, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            hashLength: 50,
        });
    }
    async compare(pw: string, hash: string): Promise<boolean> {
        return argon2.verify(hash, pw)
    }

}