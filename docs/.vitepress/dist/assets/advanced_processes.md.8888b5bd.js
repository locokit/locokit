import{_ as e,c as s,o as t,d as a}from"./app.5ea13208.js";const w='{"title":"Processes / Workflows","description":"","frontmatter":{},"headers":[{"level":2,"title":"What is sent to the webhook","slug":"what-is-sent-to-the-webhook"},{"level":2,"title":"What is expected by LocoKit in return","slug":"what-is-expected-by-locokit-in-return"}],"relativePath":"advanced/processes.md","lastUpdated":1652193922515}',o={},n=a(`<h1 id="processes-workflows" tabindex="-1">Processes / Workflows <a class="header-anchor" href="#processes-workflows" aria-hidden="true">#</a></h1><p>You can manage some logical workflows in LocoKit, with a webhook mechanism.</p><p>You can configure at several level the trigger of a URL call :</p><ul><li>when a record is created</li><li>when a record is updated</li><li>when a specific column of a record is updated</li><li>trigger manual</li></ul><p>Each call of the URL will be made with the record id in parameters.</p><h2 id="what-is-sent-to-the-webhook" tabindex="-1">What is sent to the webhook <a class="header-anchor" href="#what-is-sent-to-the-webhook" aria-hidden="true">#</a></h2><div class="language-json"><pre><code><span class="token punctuation">{</span>
  <span class="token property">&quot;table_row_id&quot;</span><span class="token operator">:</span> <span class="token string">&quot;uuid-of-the-locokit-row&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;user_id&quot;</span><span class="token operator">:</span> <span class="token number">12</span><span class="token punctuation">,</span> <span class="token comment">// id of the user that trigger this workflow</span>
  <span class="token property">&quot;process_id&quot;</span><span class="token operator">:</span> <span class="token string">&quot;uuid-of-the-locokit-process-trigerred&quot;</span>
<span class="token punctuation">}</span>
</code></pre></div><p>The data itself is not sent, so if you need it, you have to authenticate against the LocoKit platform and retrieve all the data needed through the API.</p><h2 id="what-is-expected-by-locokit-in-return" tabindex="-1">What is expected by LocoKit in return <a class="header-anchor" href="#what-is-expected-by-locokit-in-return" aria-hidden="true">#</a></h2><p>In result of the process execution, LocoKit is able to store and display some data to the end user.</p><p>LocoKit will store each process execution as a &quot;run&quot;.</p><p>Workspace&#39;s manager can read these runs through the process listing or via the detail record view, in the process panel.</p><p>LocoKit is analyzing return and expect this type of object :</p><div class="language-json"><pre><code><span class="token punctuation">{</span>
  <span class="token property">&quot;code&quot;</span><span class="token operator">:</span> <span class="token number">200</span><span class="token punctuation">,</span> <span class="token comment">// when it&#39;s ok, or any HTTP valid code</span>
  <span class="token property">&quot;message&quot;</span><span class="token operator">:</span> <span class="token string">&quot;A message that could be displayed to the end user&quot;</span> <span class="token comment">// in the success / error modal</span>
<span class="token punctuation">}</span>
</code></pre></div>`,14),r=[n];function p(c,i,l,d,h,u){return t(),s("div",null,r)}var _=e(o,[["render",p]]);export{w as __pageData,_ as default};
