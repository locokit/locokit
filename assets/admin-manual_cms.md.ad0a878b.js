import{_ as n,c as s,o as a,d as t}from"./app.78152875.js";const _='{"title":"Configuration of Blocks","description":"","frontmatter":{},"headers":[{"level":2,"title":"MapSet","slug":"mapset"}],"relativePath":"admin-manual/cms.md","lastUpdated":1640789490678}',p={},o=t(`<h1 id="configuration-of-blocks" tabindex="-1">Configuration of Blocks <a class="header-anchor" href="#configuration-of-blocks" aria-hidden="true">#</a></h1><h2 id="mapset" tabindex="-1">MapSet <a class="header-anchor" href="#mapset" aria-hidden="true">#</a></h2><p>Example of configuration :</p><div class="language-json"><pre><code><span class="token punctuation">{</span>
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
</code></pre></div>`,6),e=[o];function c(u,l,r,k,i,q){return a(),s("div",null,e)}var y=n(p,[["render",c]]);export{_ as __pageData,y as default};
