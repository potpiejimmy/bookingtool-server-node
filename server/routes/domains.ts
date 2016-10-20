import * as db from "../util/db";

var asyncLoop = require('node-async-loop');

/**
 * Returns the list of domains. For a superuser role, a complete list
 * of all domains is returned. For an admin or user role, only the list
 * of assigned domains (via DomainUser) is returned.
 * @return list of domains
 */
export function getDomains(user: any) : Promise<any> {
    return new Promise((resolve, reject) => {
        db.perform(connection => {
            if (user.roles.indexOf('superuser')>=0) {
                connection.query("SELECT * FROM domain", (err, res) => {
                    connection.release();
                    resolve(res);
                });
            } else {
                connection.query("SELECT * FROM domain_user f WHERE f.user_name=?", [user.name], (err, res) => {
                    let domains = [];
                    asyncLoop(res, (i,next) => {
                        if (!i) {next(); return;} // stupid asyncLoop loops over empty array
                        connection.query("SELECT * FROM domain WHERE id=?", [i.domain_id], (err,res) => {
                            domains.push(res[0]);
                            next();
                        })
                    }, err => { // completed loop
                        connection.release();
                        resolve(domains);
                    });
                });
            }
        })
    });
}