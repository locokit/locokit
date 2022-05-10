# Auth and permissions

## Authentication

Each user has an account on the LocoKit instance.

It is composed of a login/password couple.

Several scenarios have been implemented to help the user manage its account :
* lost password
  * a user can receive an email to update its password
* update email
  * the validation of updating a user email use a confirmation link sent to the old email
* create an account
  * this feature can be enabled or disabled through the environment variable `SIGNUP_ALLOWED`
  * when the user sign up, he receive an email with a confirmation link to check its email (link valid for 5 days)
  * once clicked, he will need to define its password

Each user account on the LocoKit instance
can be manage through the user administration UI,
only available for `SUPERADMIN` / `ADMIN` user profile.

## Permissions

Permissions are managed at several levels :
* platform / instance level, with the user profile
* group level, according user's role in the group, or above
* workspace level, according user's permissions
* process level

### Platform / instance level

Each user has a unique profile at the instance level.

Four profiles are available :

| Profile        | Permissions                                           |
| -------------- | ----------------------------------------------------- |
| **USER**       | can access to its group and all related resources     |
| **CREATOR**    | can create / manage workspace (it owns)               |
| **ADMIN**      | can create users and change profile until ADMIN grade |
|                | can see all workspaces                                |
|                | can create groups                                     |
|                | can affect users to groups                            |
| **SUPERADMIN** | manage the instance (config, theme, ...)              |
|                | update users' profile                                 |



If a user is deleted, that implies we replace every action of this user by an anonymous user.

A logged user can create workspace and manage them individually.

Each workspace's visualization is available through groups of user.

All users are readable by all users.


### Group level

A group is a user's set.

Each user in a group will have a role.

Three roles exist :

| Role       | Permissions                                        |
| ---------- | -------------------------------------------------- |
| **MEMBER** | Can access to the group and group's resources      |
| **ADMIN**  | Can add / remove user, update role until ADMIN     |
| **OWNER**  | Can delete the group, update role until OWNER      |

Each group is linked to an ACL set,
and a user can be member of several groups, linked to the same workspace.

A user can then access the same workspace through different groups,
allowing him to browse workspace data with specific permissions / visualizations.

All groups are readable by all users.

### Workspace level

At the workspace level, the workspace's managers (or `SUPERADMIN`/`ADMIN` users)
can manage permissions at the record level.

On each table, and for each ACL set, 
permissions can be defined for **creation, reading, updating and removing**.

For reading, updating and removing, **filters can be applied too**,
allowing managers to define specific rules, adapted to the ACL set.
For now, these filters need to be written by hand, as a JSON field.

These rules are applied for **file/attachment access** too. 
A user can only access to the files related to the record he has access.

**Processes / workflows** are managed by managers only and `SUPERADMIN`/`ADMIN` users. 
They can configure the processes and trigger runs of it.

Users with access but without manager privilege cannot see processes of the workspace. Neither trigger a manual process.
But, according to the configuration of the processes on the workspace they have access, and according to ACLs on tables too, lamba users can trigger indirectly processes by their action on data.