# Authentication and permissions (wip)

User's authentication is managed
on the backend side with the `feathers-authentication-management` module.

Please read these tutorials :
* https://hackernoon.com/setting-up-email-verification-in-feathersjs-ce764907e4f2
* https://blog.feathersjs.com/how-to-setup-email-verification-in-feathersjs-72ce9882e744
* https://auk.docs.feathersjs.com/api/authentication/local-management.html

Permissions are managed at several levels.

The frontend integrate a section for managing users and groups.

This section is only available for SUPERADMIN users.

Let's explain how LCK store users, groups, and profiles.

## Users

A user is a email/password couple allowing an access 
to the locokit instance.

Each user have a profile at the instance level,
giving the user some permissions.

Four profiles are available :

| Profile        | Permissions                                           |
| -------------- | ----------------------------------------------------- |
| **USER**       | Can access to its group and all related resources     |
| **CREATOR**    | Can create / manage workspace (it owns)               |
| **ADMIN**      | can create users and change profile until ADMIN grade |
|                | can see all workspaces                                |
|                | can create groups                                     |
|                | can affect users to groups                            |
| **SUPERADMIN** | Manager of the instance (config, theme, ...)          |
|                | Manage users (creation + remove)                      |
|                | update profiles                                       |

If a user is deleted, that implies we replace every action of this user by an anonymous user.

A logged user can create workspace and manage them individually.

Each workspace's visualization is available through groups of user.

All users are readable by all users.

## Groups

A group is a user's set, linked to a workspace.

Each user in a group will have a role.

Three roles exist : **OWNER**, **ADMIN**, **MEMBER**.

| Role       | Permissions                                      |
| ---------- | ------------------------------------------------ |
| **MEMBER** | Can access to the group and authorized resources |
| **ADMIN**  | Can add / remove user, update role               |
| **OWNER**  | Can delete the group                             |

Each group is linked to a workspace.

A group can be a **manager** of a workspace if the group's property `manager` is `true`.

A group **manager** can manage the workspace
(in fact, all users that are at least **MEMBER** of this group):
* can CRUD all workspace's resources (group, database, chapter, table, ...)
* can manage permissions on workspace's resources (database, table, ...), per group
* delete the workspace

All groups are readable by all users.