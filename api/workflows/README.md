# LocoKit workflows

This folder contains a set of sub-folders,
all named by their matching workspace slug.

Each sub-folder contains workflows for the related workspace.

By creating on the API side workflows,
workflows become triggerable through LocoKit with URL like

`/api/{workspaceSlug}/workflows/workflow1/run`.

`workflow1` is the `{workflowSlug}` created from the workflow name.

The workflow in the database is linked to a filepath,
the workflow file.

Each workflow file export a default async function
taking two parameters
* a `Record<string, GenericAdapter>` of all datasource instances from `@locokit/engine`, available to directly inject data in database
* the `input` object provided from the API call (in the request body)

```ts
export default async function myWorkflow(
  adapters: Record<string, GenericAdapter>,
  input: any
) {

}
```

No permissions are managed at this level.

If the workspace has 2 datasources,
they are available through the first parameter.

For instance, the first datasource's slug is `ds_1`,
then `adapters.ds_1` is the `GenericAdapter` to this datasource.

In case of SQL datasources,
you can be more precise by using the `SQLAdapter`.
We advise you to use transactions for commiting all
SQL requests at the end of the workflow.
