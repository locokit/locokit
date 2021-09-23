# CHANGELOG

**v0.3.5**

**Feature**
* add new setting `pagination` in `TableSetSettings`
* add new setting `aggregationField` in `MapSourceSettings`
* add new settings `layout` and `paint` in the default style of a Map (`MapSourceStyle`)

**v0.3.4**

**Feature**
* add new COLUMN_TYPE : VIRTUAL_LOOKED_UP_COLUMN

**v0.3.3**

**Feature**
* add new settings `deleteAllowed` and `duplicateAllowed` in `TableSetSettings`

**v0.3.2**

**Feature**
* add new setting `addButtonTitle` on `MapSettings`

**v0.3.1**

**Feature**
* add new settings `addAllowed` / `addSourceId` on `MapSettings` for creating records

**v0.3.0**

**Feature**
* add some settings to the caught events of the map to allow to focus on a specific feature

**v0.2.9**

**Feature**
* add some map source settings to allow to customize the displayed features

**v0.2.8**

**Feature**
* add some block settings to allow the communication between the map and two blocks : the formrecord and the detailrecord
* add a way to display a popup in the map on hover 
* add new COLUMN_TYPE : DATETIME, GEOMETRY_MULTIPOINT, GEOMETRY_MULTILINESTRING, GEOMETRY_MULTIPOLYGON

**v0.2.7**

**Feature**
* improve ActionButton settings: add props to have custom content notification

**v0.2.6**

**Breaking Changes:**
* use SNAKE_UPPERCASE for BLOCK_TYPE
* Map configurations must be updated to specify the id of the source and pageDetailId prop is part of the popup configuration.

**Feature**
* improve Map settings:
  - add props selectable for edition config
  - MapSet can use multiple sources
  - MapField can use one source
* fix typo in MarkdownField

**Quality**
* improve documentation

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
