# User creation

A user can be created either by the platform administrator,
or by allowing sign up on the platform.

## User profile

Three profiles are defined in LocoKit :
* `Member` : can see workspaces / data he's allowed to
* `Creator` : same as `Member` + can create and manage its workspaces
* `Administrator` : same as `Creator` + can manage the platform, its settings, users, workspaces...

If the administrator create the user,
he will be able to define the profile user at the same time.

If the user sign up, he will automatically be configured as a `Creator`.
This will allow him to create its workspace immediately after checking
the validity of its email address.
