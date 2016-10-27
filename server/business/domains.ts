import * as db from "../util/db";
import * as utils from "../util/utils";

/**
 * Returns the list of domains. For a superuser role, a complete list
 * of all domains is returned. For an admin or user role, only the list
 * of assigned domains (via DomainUser) is returned.
 * @return list of domains
 */
export function getDomains(user: any) : Promise<any> {
    if (user.roles.indexOf('superuser')>=0) {
        return db.querySingle("SELECT * FROM domain", null);
    } else {
        return db.connection().then(connection => {
            return new Promise((resolve, reject) => {
                connection.query("SELECT * FROM domain_user f WHERE f.user_name=?", [user.name], (err, res) => {
                    let domains = [];
                    utils.asyncLoop(res, (i,next) => {
                        connection.query("SELECT * FROM domain WHERE id=?", [i.domain_id], (err,res) => {
                            domains.push(res[0]);
                            next();
                        })
                    }, () => { // completed loop
                        connection.release();
                        resolve(domains);
                    });
                });
            });
        });
    }
}
