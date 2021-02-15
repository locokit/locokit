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

Three profiles are available : **SUPERADMIN**, **ADMIN**, **USER**.

| Profile        | Permissions                             |
| -------------- | --------------------------------------- |
| **USER**       | Can create / manage workspace (it owns) |
| **ADMIN**      | Can affect users to all groups          |
| **SUPERADMIN** | Manager of the instance                 |
|                | create users                            |
|                | update profiles                         |

A logged user can create workspace and manage them individually.

Each workspace's visualization is available through groups of user.

## Groups

A group is a user's set, linked to a workspace.

Each user in a group will have a role.

Three roles exist : **OWNER**, **ADMIN**, **MEMBER**.

| Role       | Permissions                                      |
| ---------- | ------------------------------------------------ |
| **MEMBER** | Can access to the group and authorized resources |
| **ADMIN**  | Can add / remove user, update role               |
| **OWNER**  | Can delete the group                             |

Each group linked to a workspace will have a role, too.

Three roles exist : **OWNER**, **ADMIN**, **MEMBER**. (same role than users)

| Role       | Permissions                                          |
| ---------- | ---------------------------------------------------- |
| **MEMBER** | Can access to the workspace and authorized resources |
| **ADMIN**  | Can add / remove groups to the workspace             |
| **OWNER**  | Can delete the workspace                             |

A group `MEMBER` can access to the workspace 
through visualization only, and via only one chapter.

A group `ADMIN` can access to the workspace's databases.
This group can also alter the database schema,
but can't manage permissions on the tables / columns.

A group `OWNER` can manage groups having access to this workspace,
and their roles (`MEMBER`, `ADMIN`, `OWNER`).
It can also manage permissions of tables / columns / rows,
per group.