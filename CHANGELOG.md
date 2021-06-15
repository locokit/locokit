# CHANGELOG

**v0.2.5**

**Breaking Changes:**
* rename block:
  - TableView -> TableSet
  - DetailView -> DataRecord
  - KanbanView -> KanbanSet
  - MapView -> MapSet
  - Synthesis -> HighlightField
  - MapDetailView -> MapField
* remove Heading, GridView

**Feature**
* add new block: FormRecord, MarkdownField, CardSet
* fix prop id in ActionButton
* improve Block with display conditional and elevation prop
* add textColor and textAlign settings in MarkdownSettings

**Quality**
* improve documentation

**v0.2.4**

**Quality**
* add new prop in `ACTIONBUTTON` Block

**v0.2.3**

**Feature**
* add new `ACTIONBUTTON` Block

**v0.2.2**

**Feature**
* add new `USER_PROFILE` : `CREATOR`, allowing users to create workspace @mda

**v0.2.1**

**Feature**
* add prop `pageDetailId` in `MapSettings` @alc

**v0.2.0**

**Quality**
* add eslint with standard typescript

**Feature**
* add new `MAPVIEW` Block
* add new `MAPDETAILVIEW` Block
* add new `SYNTHESIS` Block

**v0.1.5**

* add new `GEOMETRY_POINT` `COLUMN_TYPE`
* add new `GEOMETRY_POLYGON` `COLUMN_TYPE`
* add new `GEOMETRY_LINESTRING` `COLUMN_TYPE`

**v0.1.4**

* add new `URL` `COLUMN_TYPE`

**v0.1.3**

* add `addAllowed` and `exportAllowed` for `TableViewSettings`

**v0.1.2**

* add `pageDetailId` for `TableViewSettings`

**v0.1.1**

* add errors labels

**v0.1.0**

* add first errors code for sharing backend/frontend

**v0.0.11**

* dissociate settings in separated interfaces for all type of Blocks

**v0.0.10**

* use of `enum` instead of `const` for
  * `COLUMN_TYPE`
  * `USER_PROFILE`
  * `GROUP_ROLE`
  * `WORKSPACE_ROLE`

**v0.0.9**

* add BLOCK_TYPE
* add MEDIA_TYPE
* add interfaces definition for Blocks
  * BlockParagraph
  * BlockMardown
  * BlockTableView
  * BlockKanbanView
  * BlockMedia

**v0.0.8**

* add the `TEXT` `COLUMN_TYPE`

**v0.0.7**

* add the `WORKSPACE_ROLE`

**v0.0.6**

* add the group role`ADMIN`

**v0.0.5**

* add `MULTI_USER` and `MULTI_GROUP`

**v0.0.4**

* transpilation TS > JS
* generation of d.ts file

**v0.0.3**

* use of TypeScript

**v0.0.2 & v0.0.1**

* initial versions to be aligned to lck-api project
