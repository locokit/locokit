import{_ as e,c as t,o as a,d as r}from"./app.ee1354cf.js";const m='{"title":"Authentication and permissions (wip)","description":"","frontmatter":{},"headers":[{"level":2,"title":"Users","slug":"users"},{"level":2,"title":"Groups","slug":"groups"}],"relativePath":"admin-manual/auth.md","lastUpdated":1645698298911}',s={},o=r('<h1 id="authentication-and-permissions-wip" tabindex="-1">Authentication and permissions (wip) <a class="header-anchor" href="#authentication-and-permissions-wip" aria-hidden="true">#</a></h1><p>User&#39;s authentication is managed on the backend side with the <code>feathers-authentication-management</code> module.</p><p>Please read these tutorials :</p><ul><li><a href="https://hackernoon.com/setting-up-email-verification-in-feathersjs-ce764907e4f2" target="_blank" rel="noopener noreferrer">https://hackernoon.com/setting-up-email-verification-in-feathersjs-ce764907e4f2</a></li><li><a href="https://blog.feathersjs.com/how-to-setup-email-verification-in-feathersjs-72ce9882e744" target="_blank" rel="noopener noreferrer">https://blog.feathersjs.com/how-to-setup-email-verification-in-feathersjs-72ce9882e744</a></li><li><a href="https://auk.docs.feathersjs.com/api/authentication/local-management.html" target="_blank" rel="noopener noreferrer">https://auk.docs.feathersjs.com/api/authentication/local-management.html</a></li></ul><p>Permissions are managed at several levels.</p><p>The frontend integrate a section for managing users and groups.</p><p>This section is only available for SUPERADMIN users.</p><p>Let&#39;s explain how LCK store users, groups, and profiles.</p><h2 id="users" tabindex="-1">Users <a class="header-anchor" href="#users" aria-hidden="true">#</a></h2><p>A user is a email/password couple allowing an access to the locokit instance.</p><p>Each user have a profile at the instance level, giving the user some permissions.</p><p>Four profiles are available :</p><table><thead><tr><th>Profile</th><th>Permissions</th></tr></thead><tbody><tr><td><strong>USER</strong></td><td>can access to its group and all related resources</td></tr><tr><td><strong>CREATOR</strong></td><td>can create / manage workspace (it owns)</td></tr><tr><td><strong>ADMIN</strong></td><td>can create users and change profile until ADMIN grade</td></tr><tr><td></td><td>can see all workspaces</td></tr><tr><td></td><td>can create groups</td></tr><tr><td></td><td>can affect users to groups</td></tr><tr><td><strong>SUPERADMIN</strong></td><td>manager the instance (config, theme, ...)</td></tr><tr><td></td><td>update users&#39; profile</td></tr></tbody></table><p>If a user is deleted, that implies we replace every action of this user by an anonymous user.</p><p>A logged user can create workspace and manage them individually.</p><p>Each workspace&#39;s visualization is available through groups of user.</p><p>All users are readable by all users.</p><h2 id="groups" tabindex="-1">Groups <a class="header-anchor" href="#groups" aria-hidden="true">#</a></h2><p>A group is a user&#39;s set.</p><p>Each user in a group will have a role.</p><p>Three roles exist : <strong>OWNER</strong>, <strong>ADMIN</strong>, <strong>MEMBER</strong>.</p><table><thead><tr><th>Role</th><th>Permissions</th></tr></thead><tbody><tr><td><strong>MEMBER</strong></td><td>Can access to the group and authorized resources</td></tr><tr><td><strong>ADMIN</strong></td><td>Can add / remove user, update role</td></tr><tr><td><strong>OWNER</strong></td><td>Can delete the group</td></tr></tbody></table><p>Each group is linked to an ACL set, and a user can be member of several groups, linked to the same workspace.</p><p>So, a user can access the same workspace through different groups, allowing him to browse workspace data with specific permissions / visualizations.</p><p>All groups are readable by all users.</p>',25),n=[o];function i(d,l,p,c,h,u){return a(),t("div",null,n)}var f=e(s,[["render",i]]);export{m as __pageData,f as default};
