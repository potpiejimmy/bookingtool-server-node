import * as utils from "../util/utils";
import * as db from "../util/db";

/**
 * Returns all projects the current user is a manager of.
 * @return list of projects assigned as project manager
 */
export function getManagedProjects(user: any): Promise<any> {
    if (user.roles.indexOf("superuser")>=0)
        return db.querySingle("select * from project");
    else {
        return db.querySingle("SELECT p.* FROM project_manager f,project p WHERE f.project_id=p.id AND f.user_name=? AND p.status=0 ORDER BY p.name", [user.name]);
    }
}

/**
 * Returns whether the given project is managed by the current user
 * @param user current user
 * @param projectId a project id
 * @return true if user is project admin of project projectId
 */
export function isManagedProjectOf(user: any, projectId: number): Promise<boolean> {
    return getManagedProjects(user).then(projects => {
        let found: boolean = false;
        projects.forEach(p => {if (p.id == projectId) found = true;});
        return found;
    });
}
