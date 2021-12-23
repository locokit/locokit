import{_ as n,c as a,o as s,d as t}from"./app.a2baa444.js";const q='{"title":"Blocks","description":"","frontmatter":{},"headers":[{"level":2,"title":"Presentation blocks","slug":"presentation-blocks"},{"level":3,"title":"Paragraph","slug":"paragraph"},{"level":3,"title":"Markdown","slug":"markdown"},{"level":2,"title":"Data blocks","slug":"data-blocks"},{"level":2,"title":"TableSet","slug":"tableset"},{"level":2,"title":"RecordSet","slug":"recordset"},{"level":2,"title":"MapSet","slug":"mapset"},{"level":3,"title":"Advanced configuration","slug":"advanced-configuration"}],"relativePath":"concepts/block-types.md","lastUpdated":1640296032149}',o={},p=t(`<h1 id="blocks" tabindex="-1">Blocks <a class="header-anchor" href="#blocks" aria-hidden="true">#</a></h1><p>When you start to configure your application, several blocks will be available to you.</p><p>Each block will have dedicated settings. Some of them are related to data, others are for presentation only.</p><p>This section will describe all block types we have created until now.</p><h2 id="presentation-blocks" tabindex="-1">Presentation blocks <a class="header-anchor" href="#presentation-blocks" aria-hidden="true">#</a></h2><p>Presentation blocks are here to display any arbitrary text.</p><h3 id="paragraph" tabindex="-1">Paragraph <a class="header-anchor" href="#paragraph" aria-hidden="true">#</a></h3><p>Paragraph blocks display unformatted text.</p><h3 id="markdown" tabindex="-1">Markdown <a class="header-anchor" href="#markdown" aria-hidden="true">#</a></h3><p>Markdown blocks display markdown text, allowing you to display text written in markdown.</p><p>You can check Markdown syntax in the <a href="https://en.wikipedia.org/wiki/Markdown#Examples" target="_blank" rel="noopener noreferrer">wikipedia page</a>.</p><h2 id="data-blocks" tabindex="-1">Data blocks <a class="header-anchor" href="#data-blocks" aria-hidden="true">#</a></h2><p>Data blocks allow user to access data from your workspace.</p><p>According to workspace&#39;s permissions, user will be able to <strong>c</strong>reate, <strong>r</strong>ead, <strong>u</strong>pdate or <strong>d</strong>elete data.</p><p>Any data block need to be connected to a <strong>view</strong> of your tables.</p><h2 id="tableset" tabindex="-1">TableSet <a class="header-anchor" href="#tableset" aria-hidden="true">#</a></h2><p>Display a list of records, using the spreadsheet UI.</p><h2 id="recordset" tabindex="-1">RecordSet <a class="header-anchor" href="#recordset" aria-hidden="true">#</a></h2><p>Display a single record in a &quot;detail&quot; view.</p><h2 id="mapset" tabindex="-1">MapSet <a class="header-anchor" href="#mapset" aria-hidden="true">#</a></h2><p>Display a list of records on a map.</p><p>This block need settings for specifying which geometry fields need to be used.</p><h3 id="advanced-configuration" tabindex="-1">Advanced configuration <a class="header-anchor" href="#advanced-configuration" aria-hidden="true">#</a></h3><p>The settings UI for the MapSet block display a subset of all the settings the block accept.</p><p>By defining an advanced configuration, you can define more fine-grained settings, concerning map style, of interactions between blocks.</p><p>Example of configuration :</p><div class="language-json"><pre><code><span class="token punctuation">{</span>
  <span class="token property">&quot;sources&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> <span class="token string">&quot;[TABLE_VIEW_ID]&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;popup&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token property">&quot;style&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;fields&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token string">&quot;[LUC_PUBLIC_FIELD_ID]&quot;</span><span class="token punctuation">,</span>
          <span class="token string">&quot;[LUC_TYPE_FIELD_ID]&quot;</span>
        <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token property">&quot;default&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token property">&quot;fill&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token property">&quot;width&quot;</span><span class="token operator">:</span> <span class="token number">0.5</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token property">&quot;icon&quot;</span><span class="token operator">:</span> <span class="token string">&quot;/themes/capel/marker/diving-mask.png&quot;</span><span class="token punctuation">,</span>
          <span class="token property">&quot;paint&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token property">&quot;icon-opacity&quot;</span><span class="token operator">:</span> <span class="token number">1</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token property">&quot;layout&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
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
        <span class="token property">&quot;dataDriven&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token punctuation">{</span>
            <span class="token property">&quot;style&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
              <span class="token property">&quot;icon&quot;</span><span class="token operator">:</span> <span class="token string">&quot;/themes/capel/marker/shipwreck.png&quot;</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
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
            <span class="token property">&quot;style&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
              <span class="token property">&quot;icon&quot;</span><span class="token operator">:</span> <span class="token string">&quot;/themes/capel/marker/userspot.png&quot;</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token property">&quot;values&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
              <span class="token punctuation">{</span>
                <span class="token property">&quot;field&quot;</span><span class="token operator">:</span> <span class="token string">&quot;[LUC_PUBLIC_FIELD_ID]&quot;</span><span class="token punctuation">,</span>
                <span class="token property">&quot;value&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
              <span class="token punctuation">}</span>
            <span class="token punctuation">]</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token property">&quot;popupSettings&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;onHover&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token property">&quot;aggregationField&quot;</span><span class="token operator">:</span> <span class="token string">&quot;[RBT_FIELD_ID]&quot;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre></div><p>If we want to display the points even if the displayed texts overlap, we can add the following property to the layout object (default style) :</p><div class="language-"><pre><code>  &quot;text-allow-overlap&quot;: true
</code></pre></div>`,29),e=[p];function c(r,l,u,i,k,d){return s(),a("div",null,e)}var g=n(o,[["render",c]]);export{q as __pageData,g as default};
