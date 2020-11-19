# Managing users

The frontend integrate a section for managing users and groups.

This section is only available for SUPERADMIN users.

Let's explain how LCK store users, groups, and profiles.

## Users

Users are managed at the backend side with the `feathers-authentication-management` module.

Please read these tutorials :
* https://hackernoon.com/setting-up-email-verification-in-feathersjs-ce764907e4f2
* https://blog.feathersjs.com/how-to-setup-email-verification-in-feathersjs-72ce9882e744
* https://auk.docs.feathersjs.com/api/authentication/local-management.html

## Groups

## Profiles

Several profile exist, and they are stored at two levels :
* user level, explaining the profile of this user for the current instance
* group level, explaining the rights the user will have on this specific group

### User level profile

Three profiles exist : **SUPERADMIN**, **ADMIN**, **USER**.

| Profile        | Permissions                                      |
| -------------- | ------------------------------------------------ |
| **SUPERADMIN** | Manager of the platform                          |
| **ADMIN**      | Can affect users to groups, can create workspace |
| **USER**       | Can create / manage workspace                    |

### Group level profile

Three roles exist : **OWNER**, **ADMIN**, **MEMBER**.

| Role       | Permissions                                      |
| ---------- | ------------------------------------------------ |
| **OWNER**  | Can delete the group and all related resources   |
| **ADMIN**  | Can add / remove user to the group               |
| **MEMBER** | Can access to the group and authorized resources |