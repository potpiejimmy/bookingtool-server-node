import * as crypto from "crypto";
import * as auth from "../util/auth";
import * as db from "../util/db";

export function changePassword(user: any, oldPassword: string, newPassword: string): Promise<any> {
    return db.querySingle("select * from user where name=?",[user.name]).then(res => {
        let dbUser = res[0];
        if (crypto.createHash('md5').update(oldPassword).digest("hex") != dbUser.password)
            return Promise.reject("Sorry, you entered the wrong password.");
        if (oldPassword == newPassword)
            return Promise.reject("Sorry, the new password cannot be the same as the old password.");

        return db.querySingle("UPDATE user SET password=?, pw_status=1 WHERE name=?", [
            crypto.createHash('md5').update(newPassword).digest("hex"),
            user.name
        ]);
    });
}
