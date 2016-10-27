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
        return db.querySingle("SELECT * FROM domain");
    } else {
        return db.connection().then(connection => 
            db.query(connection, "SELECT * FROM domain_user f WHERE f.user_name=?", [user.name]).then(res => {
                let domains = [];
                return utils.asyncLoopP(res, (i,next) => {
                    db.query(connection, "SELECT * FROM domain WHERE id=?", [i.domain_id]).then(res => {
                        domains.push(res[0]);
                        next();
                    });
                }).then(() => { // completed loop
                    connection.release();
                    return domains;
                });
            })
        );
    }
}
