import * as jwt from "jsonwebtoken";
import * as expressjwt from "express-jwt";

const SECRET = 'supersecret';

export function createToken(data:any):any {
    return jwt.sign(data, SECRET, {
            expiresIn: 60 * 60 * 24 * 30 // 30 days
    });
}

export function verifyToken() {
    return expressjwt({secret: SECRET});
}
