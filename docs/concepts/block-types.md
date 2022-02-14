# Blocks

When you start to configure your application,
several blocks will be available to you.

Each block will have dedicated settings.
Some of them are related to data in your database,
others are just for presentation.

This section will describe all block types we have created until now.

## Presentation blocks

Presentation blocks are here to display any arbitrary information.

### Paragraph

Paragraph blocks display unformatted text.

### Markdown

Markdown blocks display markdown text, allowing you
to display text written in markdown.

You can check Markdown syntax in the [wikipedia page](https://en.wikipedia.org/wiki/Markdown#Examples).

### Media

Media block allow to display image, video or gallery.

This is a work in progress.

## Data blocks

Data blocks allow user to access data from your workspace.

According to workspace's permissions,
user will be able to **c**reate, **r**ead, **u**pdate or **d**elete
data.

Any data block need to be connected to a **view** 
of your tables.

## TableSet

Display a list of records, using the spreadsheet UI.

## RecordSet

Display a single record in a "detail" view.

## KanbanSet

Display a data according to Kanban's method.

This is a work in progress.

## HighlightField

Display a single value to enhance its visibility.

This is a work in progress.

## Cardset

Display data as a card.

This is a work in progress.

## ActionButton

Allow to trigger an action like a process and/or a redirection.

## MarkdownField

Display markdown data.

## FormRecord

Display a form for a record.
Each column becomes the label of the input field and
it is possible to prevent user to update specific field.

## ExternalApp

Display a link to external app.

## MapRecord

Like below but only for a record.

## MapSet

Display a list of records on a map.

This block need settings for specifying which geometry fields
need to be used.

### Advanced configuration

The settings UI for the MapSet block display a subset
of all the settings the block accept.

By defining an advanced configuration, 
you can define more fine-grained settings,
concerning map style, of interactions between blocks.

Example of configuration :

```json
{
  "sources": [
    {
      "id": "[TABLE_VIEW_ID]",
      "popup": true,
      "style": {
        "fields": [
          "[LUC_PUBLIC_FIELD_ID]",
          "[LUC_TYPE_FIELD_ID]"
        ],
        "default": {
          "fill": {
            "width": 0.5
          },
          "icon": "/themes/capel/marker/diving-mask.png",
          "paint": {
            "icon-opacity": 1
          },
          "layout": {
            "text-field": [
              "get",
              "point_count"
            ],
            "text-anchor": "bottom-left",
            "text-offset": [
              1,
              0
            ]
          }
        },
        "dataDriven": [
          {
            "style": {
              "icon": "/themes/capel/marker/shipwreck.png"
            },
            "values": [
              {
                "field": "[LUC_TYPE_FIELD_ID]",
                "value": "[ARTIFICIAL_OPTION_ID]"
              },
              {
                "field": "[LUC_PUBLIC_FIELD_ID]",
                "value": true
              }
            ]
          },
          {
            "style": {
              "icon": "/themes/capel/marker/userspot.png"
            },
            "values": [
              {
                "field": "[LUC_PUBLIC_FIELD_ID]",
                "value": false
              }
            ]
          }
        ]
      },
      "popupSettings": {
        "onHover": true
      },
      "aggregationField": "[RBT_FIELD_ID]"
    }
  ]
}
```

If we want to display the points even if the displayed texts overlap,
we can add the following property to the layout object (default style):

```
  "text-allow-overlap": true
```