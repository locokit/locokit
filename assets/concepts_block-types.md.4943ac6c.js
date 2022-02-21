import{_ as a,c as n,o as s,d as t}from"./app.ee1354cf.js";var e="/assets/lck-block-tableset.0465e7c9.png",o="/assets/lck-block-datarecord.135f8154.png",p="/assets/lck-block-mapset.cd2bf36d.png",l="/assets/lck-block-actionbutton.9c7123c9.gif",r="/assets/lck-block-formrecord.c62d7bd0.png";const w='{"title":"Blocks","description":"","frontmatter":{},"headers":[{"level":2,"title":"Presentation blocks","slug":"presentation-blocks"},{"level":3,"title":"Paragraph","slug":"paragraph"},{"level":3,"title":"Markdown","slug":"markdown"},{"level":3,"title":"Media","slug":"media"},{"level":2,"title":"Data blocks","slug":"data-blocks"},{"level":3,"title":"TableSet","slug":"tableset"},{"level":3,"title":"DataRecord","slug":"datarecord"},{"level":3,"title":"MapSet","slug":"mapset"},{"level":3,"title":"MapField","slug":"mapfield"},{"level":3,"title":"ActionButton","slug":"actionbutton"},{"level":3,"title":"MarkdownField","slug":"markdownfield"},{"level":3,"title":"FormRecord","slug":"formrecord"},{"level":3,"title":"ExternalApp","slug":"externalapp"},{"level":3,"title":"KanbanSet","slug":"kanbanset"},{"level":3,"title":"HighlightField","slug":"highlightfield"},{"level":3,"title":"Cardset","slug":"cardset"}],"relativePath":"concepts/block-types.md","lastUpdated":1645476753260}',c={},i=t('<h1 id="blocks" tabindex="-1">Blocks <a class="header-anchor" href="#blocks" aria-hidden="true">#</a></h1><p>When you start to configure your application, several blocks will be available to you.</p><p>Each block will have dedicated settings. Some of them are related to data in your database, others are just for presentation.</p><p>This section will describe all block types we have created until now.</p><h2 id="presentation-blocks" tabindex="-1">Presentation blocks <a class="header-anchor" href="#presentation-blocks" aria-hidden="true">#</a></h2><p>Presentation blocks are here to display any arbitrary information.</p><h3 id="paragraph" tabindex="-1">Paragraph <a class="header-anchor" href="#paragraph" aria-hidden="true">#</a></h3><p>Paragraph blocks display unformatted text.</p><h3 id="markdown" tabindex="-1">Markdown <a class="header-anchor" href="#markdown" aria-hidden="true">#</a></h3><p>Markdown blocks display markdown text, allowing you to display text written in markdown.</p><p>You can check Markdown syntax in the <a href="https://en.wikipedia.org/wiki/Markdown#Examples" target="_blank" rel="noopener noreferrer">wikipedia page</a>.</p><h3 id="media" tabindex="-1">Media <a class="header-anchor" href="#media" aria-hidden="true">#</a></h3><p>Media blocks are intented to display images and videos. For now, you can use it to display a single external image by specifing its URL.</p><p>This is a work in progress.</p><h2 id="data-blocks" tabindex="-1">Data blocks <a class="header-anchor" href="#data-blocks" aria-hidden="true">#</a></h2><p>Data blocks allow user to access data from your workspace.</p><p>According to workspace&#39;s permissions, user will be able to <strong>c</strong>reate, <strong>r</strong>ead, <strong>u</strong>pdate or <strong>d</strong>elete data.</p><p>Any data block need to be connected to a <strong>view</strong> of your tables.</p><h3 id="tableset" tabindex="-1">TableSet <a class="header-anchor" href="#tableset" aria-hidden="true">#</a></h3><p>Display a list of records, using the spreadsheet UI.</p><p>Some options can be configured to display a way :</p><ul><li>to add a new record from a modal form containing the editable and displayable fields of the view.</li><li>to export the records. Only displayable and transmissible view fields are exported.</li><li>to access to the record details. You must select one of the pages of the current chapter which will be used for this purpose. For example, the linked page could contain a DataRecord block connected to a view associated to the same table that the view of the current TableSet block.</li></ul><table><thead><tr><th style="text-align:center;"><img src="'+e+'" alt="List records with a TableSet block"></th></tr></thead><tbody><tr><td style="text-align:center;">List records with a TableSet block</td></tr></tbody></table><h3 id="datarecord" tabindex="-1">DataRecord <a class="header-anchor" href="#datarecord" aria-hidden="true">#</a></h3><p>Display a single record in a &quot;detail&quot; view. More precisely, this block lists all the fields that have been configured as displayable for the view with the corresponding value of the record, either in read-only or edit mode depending on the field configuration.</p><table><thead><tr><th style="text-align:center;"><img src="'+o+'" alt="Display the details of a record with a DataRecord block"></th></tr></thead><tbody><tr><td style="text-align:center;">Display the details of a record with a DataRecord block</td></tr></tbody></table><h3 id="mapset" tabindex="-1">MapSet <a class="header-anchor" href="#mapset" aria-hidden="true">#</a></h3><p>Display a list of records on a map.</p><p>This block needs settings for specifying which geometry fields need to be used.</p><p>Moreover, you can display a popup when the user clicks on or hovers over an item. This popup may display information related to the targeted element.</p><p>If you want to display several geographical fields on the same map, it is recommended to add a geographical source by geographical field by specifying at least the view that contain this field and the field itself.</p><p>Furthermore, you can also aggregate the records to display only one geographical element for a set of records. In this case, the aggregation field must be a <em>Link to another table</em> field and the displayed geographic fields must be <em>Lookup</em> or <em>Virtual lookup</em> fields linked to the aggregation field and must contain geographical data. Note that a <code>point_count</code> property is automatically added to the Mapbox source data which corresponds to the number of elements that have been aggregated on a single point.</p><table><thead><tr><th style="text-align:center;"><img src="'+p+`" alt="Display geographical data in a map with a MapSet block"></th></tr></thead><tbody><tr><td style="text-align:center;">Display geographical data in a map with a MapSet block</td></tr></tbody></table><h4 id="advanced-configuration" tabindex="-1">Advanced configuration <a class="header-anchor" href="#advanced-configuration" aria-hidden="true">#</a></h4><p>The settings UI for the MapSet block display a subset of all the settings the block accept.</p><p>By defining an advanced configuration, you can define more fine-grained settings, concerning map style, or interactions between blocks.</p><p>There are several complementary ways to define the style of the geographical data displayed by this block. This style is specific to one geographical <strong>source</strong> and translated into the Mapbox style format. It contains the following properties:</p><ul><li><p><code>default</code> (facultative): contains the default style that you want to apply.</p><p>It must be an object respecting a format depending on the field type:</p><ul><li><p><strong>Point geometry</strong> and <strong>Multi-point geometry</strong> :</p><div class="language-typescript"><pre><code><span class="token punctuation">{</span>
  <span class="token comment">// Customize the filled part of the circle</span>
  fill<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    color<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span> <span class="token comment">// The color, respecting the Mapbox color format</span>
    width<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span> <span class="token comment">// The radius, in pixels</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token comment">// Customize the circle&#39;s border</span>
  stroke<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    color<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span> <span class="token comment">// The color, respecting the Mapbox color format</span>
    width<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span> <span class="token comment">// The width, in pixels</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token comment">// Display an external icon</span>
  icon<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span> <span class="token comment">// URL of the icon to display. Be careful, with this property, the stroke color will no be used and the unit used to compute the size of the point (fill width) will no be the pixel but the original icon size</span>
  <span class="token comment">// The next two properties allow you to override the previous ones by using the Mapbox style properties directly</span>
  layout<span class="token operator">?</span><span class="token operator">:</span> object<span class="token punctuation">;</span>
  paint<span class="token operator">?</span><span class="token operator">:</span> object<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div></li><li><p><strong>Linestring geometry</strong> and <strong>Multi-linestring geometry</strong> :</p><div class="language-typescript"><pre><code><span class="token punctuation">{</span>
  <span class="token comment">// Customize the line</span>
  fill<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    color<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span> <span class="token comment">// The color, respecting the Mapbox color format</span>
    width<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span> <span class="token comment">// The stroke thickness, in pixels</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token comment">// The next two properties allow you to override the previous ones by using the Mapbox style properties directly</span>
  layout<span class="token operator">?</span><span class="token operator">:</span> object<span class="token punctuation">;</span>
  paint<span class="token operator">?</span><span class="token operator">:</span> object<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div></li><li><p><strong>Polygon geometry</strong> and <strong>Multi-polygon geometry</strong> :</p><div class="language-typescript"><pre><code><span class="token punctuation">{</span>
  <span class="token comment">// Customize the filled part of the polygon</span>
  fill<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    color<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span> <span class="token comment">// The color, respecting the Mapbox color format</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token comment">// Customize the polygon&#39;s border</span>
  stroke<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    color<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span> <span class="token comment">// The color, respecting the Mapbox color format</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token comment">// The next two properties allow you to override the previous ones by using the Mapbox style properties directly</span>
  layout<span class="token operator">?</span><span class="token operator">:</span> object<span class="token punctuation">;</span>
  paint<span class="token operator">?</span><span class="token operator">:</span> object<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div></li></ul></li><li><p><code>dataDriven</code> (facultative): contains the styles that you want to use to customize the layers depending on the fields values. Must be an array containing objects which respect this format:</p><div class="language-typescript"><pre><code><span class="token punctuation">{</span>
  <span class="token comment">// The condition to apply the style</span>
  values<span class="token operator">:</span> <span class="token punctuation">{</span>
    field<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span> <span class="token comment">// uuid of the field to check</span>
    value<span class="token operator">:</span> <span class="token builtin">unknown</span><span class="token punctuation">;</span> <span class="token comment">// value that the field must have to apply associated style</span>
  <span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token comment">// The style to apply if the conditions are met </span>
  style<span class="token operator">:</span> object<span class="token punctuation">;</span> <span class="token comment">// Same as the default style but without the layout and paint properties</span>
<span class="token punctuation">}</span>
</code></pre></div></li><li><p><code>fields</code> (mandatory if you use the previous property): a list containing the uuids of the fields that you want to use to customize the layers depending of the fields values.</p></li></ul><p>Example of configuration :</p><div class="language-json"><pre><code><span class="token punctuation">{</span>
  <span class="token property">&quot;sources&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token comment">// Define a first source that will contain our geographical data (Point field)</span>
    <span class="token punctuation">{</span>
      <span class="token comment">// Id of the table view that contains the geographical data</span>
      <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> <span class="token string">&quot;[TABLE_VIEW_ID]&quot;</span><span class="token punctuation">,</span>
      <span class="token comment">// The geographical data is aggregated according to the value of this field</span>
      <span class="token property">&quot;aggregationField&quot;</span><span class="token operator">:</span> <span class="token string">&quot;[RBT_FIELD_ID]&quot;</span><span class="token punctuation">,</span>
      <span class="token comment">// Choose to display the popup</span>
      <span class="token property">&quot;popup&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token comment">// Only display the popup on hover</span>
      <span class="token property">&quot;popupSettings&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;onHover&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token comment">// Custom the style layer</span>
      <span class="token property">&quot;style&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token comment">// Define a default style</span>
        <span class="token property">&quot;default&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token property">&quot;fill&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token property">&quot;width&quot;</span><span class="token operator">:</span> <span class="token number">0.5</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token comment">// Display icons instead of circles</span>
          <span class="token property">&quot;icon&quot;</span><span class="token operator">:</span> <span class="token string">&quot;/themes/capel/marker/diving-mask.png&quot;</span><span class="token punctuation">,</span>
          <span class="token comment">// Use mapbox layer style properties</span>
          <span class="token property">&quot;paint&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token property">&quot;icon-opacity&quot;</span><span class="token operator">:</span> <span class="token number">1</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token property">&quot;layout&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token comment">// Display the number of records that have been aggregated</span>
            <span class="token property">&quot;text-field&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
              <span class="token string">&quot;get&quot;</span><span class="token punctuation">,</span>
              <span class="token string">&quot;point_count&quot;</span>
            <span class="token punctuation">]</span><span class="token punctuation">,</span>
            <span class="token property">&quot;text-anchor&quot;</span><span class="token operator">:</span> <span class="token string">&quot;bottom-left&quot;</span><span class="token punctuation">,</span>
            <span class="token property">&quot;text-offset&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
              <span class="token number">1</span><span class="token punctuation">,</span>
              <span class="token number">0</span>
            <span class="token punctuation">]</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token comment">// Fields that will be used to custom the style depending on their values</span>
        <span class="token property">&quot;fields&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token string">&quot;[LUC_PUBLIC_FIELD_ID]&quot;</span><span class="token punctuation">,</span>
          <span class="token string">&quot;[LUC_TYPE_FIELD_ID]&quot;</span>
        <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token comment">// Styles to apply to customize the map layers depending on the fields values</span>
        <span class="token property">&quot;dataDriven&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token punctuation">{</span>
            <span class="token comment">// Choose another icon</span>
            <span class="token property">&quot;style&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
              <span class="token property">&quot;icon&quot;</span><span class="token operator">:</span> <span class="token string">&quot;/themes/capel/marker/shipwreck.png&quot;</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token comment">// Conditions to meet to apply the style (artificial and public point) </span>
            <span class="token property">&quot;values&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
              <span class="token punctuation">{</span>
                <span class="token property">&quot;field&quot;</span><span class="token operator">:</span> <span class="token string">&quot;[LUC_TYPE_FIELD_ID]&quot;</span><span class="token punctuation">,</span>
                <span class="token property">&quot;value&quot;</span><span class="token operator">:</span> <span class="token string">&quot;[ARTIFICIAL_OPTION_ID]&quot;</span>
              <span class="token punctuation">}</span><span class="token punctuation">,</span>
              <span class="token punctuation">{</span>
                <span class="token property">&quot;field&quot;</span><span class="token operator">:</span> <span class="token string">&quot;[LUC_PUBLIC_FIELD_ID]&quot;</span><span class="token punctuation">,</span>
                <span class="token property">&quot;value&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span>
              <span class="token punctuation">}</span>
            <span class="token punctuation">]</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token punctuation">{</span>
            <span class="token comment">// Choose another icon</span>
            <span class="token property">&quot;style&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
              <span class="token property">&quot;icon&quot;</span><span class="token operator">:</span> <span class="token string">&quot;/themes/capel/marker/userspot.png&quot;</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token comment">// Conditions to meet to apply the style (private point)</span>
            <span class="token property">&quot;values&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
              <span class="token punctuation">{</span>
                <span class="token property">&quot;field&quot;</span><span class="token operator">:</span> <span class="token string">&quot;[LUC_PUBLIC_FIELD_ID]&quot;</span><span class="token punctuation">,</span>
                <span class="token property">&quot;value&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
              <span class="token punctuation">}</span>
            <span class="token punctuation">]</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre></div><p>If we want to display the points even if the displayed texts overlap, we can add the following property to the layout object (default style):</p><div class="language-"><pre><code>  &quot;text-allow-overlap&quot;: true
</code></pre></div><h3 id="mapfield" tabindex="-1">MapField <a class="header-anchor" href="#mapfield" aria-hidden="true">#</a></h3><p>Display a single record on a map.</p><p>This block works in the same way as the <strong>MapSet</strong> block except that only one source can be configured, and therefore displayed.</p><h3 id="actionbutton" tabindex="-1">ActionButton <a class="header-anchor" href="#actionbutton" aria-hidden="true">#</a></h3><p>Display a button which triggers a process and/or redirects.</p><p>It should be placed in a details page i.e. a page linked to a single record, allowing for example to deactivate or not the button depending on the value of a view field of this record.</p><p>If a process is triggered, a notification can be displayed on the screen depending on the success or the failure of the process.</p><table><thead><tr><th style="text-align:center;"><img src="`+l+'" alt="Trigger a process with an ActionButton block"></th></tr></thead><tbody><tr><td style="text-align:center;">Trigger a process with an ActionButton block</td></tr></tbody></table><h3 id="markdownfield" tabindex="-1">MarkdownField <a class="header-anchor" href="#markdownfield" aria-hidden="true">#</a></h3><p>Display the value of a view field of one record, in a markdown component, allowing you to customize its style.</p><h3 id="formrecord" tabindex="-1">FormRecord <a class="header-anchor" href="#formrecord" aria-hidden="true">#</a></h3><p>Display a creation form allowing to create a record in the table associated with the chosen view.</p><p>It is very similar to the DataRecord block but for creation.</p><table><thead><tr><th style="text-align:center;"><img src="'+r+`" alt="Create a new record with a FormRecord block"></th></tr></thead><tbody><tr><td style="text-align:center;">Create a new record with a FormRecord block</td></tr></tbody></table><h3 id="externalapp" tabindex="-1">ExternalApp <a class="header-anchor" href="#externalapp" aria-hidden="true">#</a></h3><p>Display an iframe whose the url is specified in the settings, allowing to embed an HTML page.</p><p>The url consists of static and/or dynamic parts, specified in the block settings in the <code>parts</code> property that contains a list of the differents parts of the URL.</p><p>If the part is static, we configure it as this example:</p><div class="language-json"><pre><code><span class="token punctuation">{</span>
  <span class="token property">&quot;type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;String&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;string&quot;</span><span class="token operator">:</span> <span class="token string">&quot;https://locokit.io/iframe/&quot;</span> 
<span class="token punctuation">}</span>
</code></pre></div><p>If the part is dynamic, we can provide a view and a field of this view whose the corresponding value of the record will be added to the url, as this example:</p><div class="language-json"><pre><code><span class="token punctuation">{</span>
  <span class="token property">&quot;type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Source&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> <span class="token string">&quot;[TABLE_VIEW_ID]&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;fieldId&quot;</span><span class="token operator">:</span> <span class="token string">&quot;[FIELD_ID]&quot;</span>
<span class="token punctuation">}</span>
</code></pre></div><h3 id="kanbanset" tabindex="-1">KanbanSet <a class="header-anchor" href="#kanbanset" aria-hidden="true">#</a></h3><p>Display a data according to Kanban&#39;s method.</p><p>This is a work in progress.</p><h3 id="highlightfield" tabindex="-1">HighlightField <a class="header-anchor" href="#highlightfield" aria-hidden="true">#</a></h3><p>Display a single value to enhance its visibility.</p><p>This is a work in progress.</p><h3 id="cardset" tabindex="-1">Cardset <a class="header-anchor" href="#cardset" aria-hidden="true">#</a></h3><p>Display data as a card.</p><p>This is a work in progress.</p>`,72),u=[i];function d(k,h,g,m,y,b){return s(),n("div",null,u)}var q=a(c,[["render",d]]);export{w as __pageData,q as default};
