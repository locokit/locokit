# Configuration of Blocks

## MapSet

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

If we want to display the points even if the displayed texts overlap, we can add the following property to the layout object (default style) :

```
  "text-allow-overlap": true
```