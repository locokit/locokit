# Theme

LocoKit is provided with a default theme, the `locokit` theme.

Themes are available under `front/public/themes`.

You could create a new theme by respecting these requirements :

In development mode
* create a new directory under `front/public/themes`
* inside this directory,
  * one `theme.css` file, defining all css variables needed by LocoKit
  * one `theme.js` file, defining images for several places in the app
  * images this directory, and all assets needed by your theme (fonts, favicon,...)
  
When this theme is finished, 
you could deliver this theme in your `docker-compose` file
by binding a volume dedicated to this theme.

In our container, the `/code/public/themes` is the directory containing themes.

You'll have to build a `index.html` too, 
referencing the defined theme, with the `npm run build:html`
available in the `front` directory.
By defining environment variables `VUE_APP_TITLE` and `VUE_APP_THEME`,
your `index.html` will load your `theme.js`, `theme.css`, etc from your theme.