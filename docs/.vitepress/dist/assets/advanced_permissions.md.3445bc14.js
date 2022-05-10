import{_ as e,c as t,o as a,d as s}from"./app.5ea13208.js";const m='{"title":"Auth and permissions","description":"","frontmatter":{},"headers":[{"level":2,"title":"Authentication","slug":"authentication"},{"level":2,"title":"Permissions","slug":"permissions"},{"level":3,"title":"Platform / instance level","slug":"platform-instance-level"},{"level":3,"title":"Group level","slug":"group-level"},{"level":3,"title":"Workspace level","slug":"workspace-level"}],"relativePath":"advanced/permissions.md","lastUpdated":1652219221217}',r={},o=s('<h1 id="auth-and-permissions" tabindex="-1">Auth and permissions <a class="header-anchor" href="#auth-and-permissions" aria-hidden="true">#</a></h1><h2 id="authentication" tabindex="-1">Authentication <a class="header-anchor" href="#authentication" aria-hidden="true">#</a></h2><p>Each user has an account on the LocoKit instance.</p><p>It is composed of a login/password couple.</p><p>Several scenarios have been implemented to help the user manage its account :</p><ul><li>lost password <ul><li>a user can receive an email to update its password</li></ul></li><li>update email <ul><li>the validation of updating a user email use a confirmation link sent to the old email</li></ul></li><li>create an account <ul><li>this feature can be enabled or disabled through the environment variable <code>SIGNUP_ALLOWED</code></li><li>when the user sign up, he receive an email with a confirmation link to check its email (link valid for 5 days)</li><li>once clicked, he will need to define its password</li></ul></li></ul><p>Each user account on the LocoKit instance can be manage through the user administration UI, only available for <code>SUPERADMIN</code> / <code>ADMIN</code> user profile.</p><h2 id="permissions" tabindex="-1">Permissions <a class="header-anchor" href="#permissions" aria-hidden="true">#</a></h2><p>Permissions are managed at several levels :</p><ul><li>platform / instance level, with the user profile</li><li>group level, according user&#39;s role in the group, or above</li><li>workspace level, according user&#39;s permissions</li><li>process level</li></ul><h3 id="platform-instance-level" tabindex="-1">Platform / instance level <a class="header-anchor" href="#platform-instance-level" aria-hidden="true">#</a></h3><p>Each user has a unique profile at the instance level.</p><p>Four profiles are available :</p><table><thead><tr><th>Profile</th><th>Permissions</th></tr></thead><tbody><tr><td><strong>USER</strong></td><td>can access to its group and all related resources</td></tr><tr><td><strong>CREATOR</strong></td><td>can create / manage workspace (it owns)</td></tr><tr><td><strong>ADMIN</strong></td><td>can create users and change profile until ADMIN grade</td></tr><tr><td></td><td>can see all workspaces</td></tr><tr><td></td><td>can create groups</td></tr><tr><td></td><td>can affect users to groups</td></tr><tr><td><strong>SUPERADMIN</strong></td><td>manage the instance (config, theme, ...)</td></tr><tr><td></td><td>update users&#39; profile</td></tr></tbody></table><p>If a user is deleted, that implies we replace every action of this user by an anonymous user.</p><p>A logged user can create workspace and manage them individually.</p><p>Each workspace&#39;s visualization is available through groups of user.</p><p>All users are readable by all users.</p><h3 id="group-level" tabindex="-1">Group level <a class="header-anchor" href="#group-level" aria-hidden="true">#</a></h3><p>A group is a user&#39;s set.</p><p>Each user in a group will have a role.</p><p>Three roles exist :</p><table><thead><tr><th>Role</th><th>Permissions</th></tr></thead><tbody><tr><td><strong>MEMBER</strong></td><td>Can access to the group and group&#39;s resources</td></tr><tr><td><strong>ADMIN</strong></td><td>Can add / remove user, update role until ADMIN</td></tr><tr><td><strong>OWNER</strong></td><td>Can delete the group, update role until OWNER</td></tr></tbody></table><p>Each group is linked to an ACL set, and a user can be member of several groups, linked to the same workspace.</p><p>A user can then access the same workspace through different groups, allowing him to browse workspace data with specific permissions / visualizations.</p><p>All groups are readable by all users.</p><h3 id="workspace-level" tabindex="-1">Workspace level <a class="header-anchor" href="#workspace-level" aria-hidden="true">#</a></h3><p>At the workspace level, the workspace&#39;s managers (or <code>SUPERADMIN</code>/<code>ADMIN</code> users) can manage permissions at the record level.</p><p>On each table, and for each ACL set, permissions can be defined for <strong>creation, reading, updating and removing</strong>.</p><p>For reading, updating and removing, <strong>filters can be applied too</strong>, allowing managers to define specific rules, adapted to the ACL set. For now, these filters need to be written by hand, as a JSON field.</p><p>These rules are applied for <strong>file/attachment access</strong> too. A user can only access to the files related to the record he has access.</p><p><strong>Processes / workflows</strong> are managed by managers only and <code>SUPERADMIN</code>/<code>ADMIN</code> users. They can configure the processes and trigger runs of it.</p><p>Users with access but without manager privilege cannot see processes of the workspace. Neither trigger a manual process. But, according to the configuration of the processes on the workspace they have access, and according to ACLs on tables too, lamba users can trigger indirectly processes by their action on data.</p>',33),i=[o];function n(l,d,c,p,h,u){return a(),t("div",null,i)}var f=e(r,[["render",n]]);export{m as __pageData,f as default};
