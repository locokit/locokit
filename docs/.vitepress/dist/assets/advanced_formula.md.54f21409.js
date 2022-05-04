import{_ as t,c as e,o as l,d as n}from"./app.ee1354cf.js";const h='{"title":"Formula","description":"","frontmatter":{},"headers":[{"level":2,"title":"Basis","slug":"basis"},{"level":3,"title":"Strings","slug":"strings"},{"level":3,"title":"Numbers","slug":"numbers"},{"level":3,"title":"Field names","slug":"field-names"},{"level":3,"title":"Functions","slug":"functions"},{"level":2,"title":"Function documentation","slug":"function-documentation"},{"level":3,"title":"Date functions","slug":"date-functions"},{"level":3,"title":"Logic functions","slug":"logic-functions"},{"level":3,"title":"Numeric functions","slug":"numeric-functions"},{"level":3,"title":"Text functions","slug":"text-functions"}],"relativePath":"advanced/formula.md","lastUpdated":1651670529622}',r={},d=n(`<h1 id="formula" tabindex="-1">Formula <a class="header-anchor" href="#formula" aria-hidden="true">#</a></h1><p>Formula columns can be used to automatically compute a value based on some constants and on the values of other fields of the record.</p><p>Here is a description of how to use them in your application.</p><h2 id="basis" tabindex="-1">Basis <a class="header-anchor" href="#basis" aria-hidden="true">#</a></h2><p>A formula may consist of the following elements:</p><h3 id="strings" tabindex="-1">Strings <a class="header-anchor" href="#strings" aria-hidden="true">#</a></h3><p>A string must be enclosed in double quotes:</p><div class="language-"><pre><code>&quot;My first formula&quot;
</code></pre></div><h3 id="numbers" tabindex="-1">Numbers <a class="header-anchor" href="#numbers" aria-hidden="true">#</a></h3><p>Integers and floats are allowed. Note that the decimal separator is the dot:</p><div class="language-"><pre><code>-10.2
</code></pre></div><h3 id="field-names" tabindex="-1">Field names <a class="header-anchor" href="#field-names" aria-hidden="true">#</a></h3><p>Only fields of the current table are allowed.</p><p>The field name must be wrapped in curly braces and must be prefixed by <code>COLUMN.</code></p><p>For instance:</p><div class="language-"><pre><code>COLUMN.{Name}
</code></pre></div><p>Not all the fields types can&#39;t be used in a formula.</p><p>For now, the following types are supported:</p><ul><li>Boolean</li><li>Integer</li><li>Float</li><li>Single line text</li><li>Long text</li><li>Date</li><li>Date and time</li><li>Single select</li><li>User (the user name)</li><li>User group (the group name)</li><li>URL</li><li>Link to another table</li></ul><p>You can also reference a <em>Lookedup field</em> if the type of the related field is specified in the previous list.</p><h3 id="functions" tabindex="-1">Functions <a class="header-anchor" href="#functions" aria-hidden="true">#</a></h3><p>A function performs an operation and always returns a single value. It can also accept parameters which can be either a string, a number, a field reference or another function.</p><p>Functions are divided into four main categories:</p><ul><li>DATE</li><li>LOGIC</li><li>NUMERIC</li><li>TEXT</li></ul><p>The name of a function must be prefixed by its category, the two being separated by a dot. Then, if there are any, the parameters must be specified between brackets and separated by commas.</p><p>For instance:</p><div class="language-"><pre><code>TEXT.CONCAT(&quot;TASK: | COLUMN.{Name})
</code></pre></div><p>The previous formula contains the <code>CONCAT</code> function of the <code>TEXT</code> category and takes two parameters. The first one is a constant string whereas the second one references the <code>Name</code> field (string field).</p><p>To help you write your formulas, autocompletion is provided, listing the different functions with their associated documentation. Moreover, the purpose, the parameters and the return type of each function will be described in the next section.</p><h2 id="function-documentation" tabindex="-1">Function documentation <a class="header-anchor" href="#function-documentation" aria-hidden="true">#</a></h2><h3 id="date-functions" tabindex="-1">Date functions <a class="header-anchor" href="#date-functions" aria-hidden="true">#</a></h3><table><thead><tr><th style="text-align:left;">Function</th><th style="text-align:left;">Description</th></tr></thead><tbody><tr><td style="text-align:left;">DATEADD</td><td style="text-align:left;">DATEADD(date: date, number: int, unit: string) \u2192 date</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the date corresponding to the date a specified number of units (&#39;year&#39;, &#39;month&#39;, &#39;day&#39;, &#39;hour&#39;, &#39;minute&#39; or &#39;second&#39;) before or after the original one.</td></tr><tr><td style="text-align:left;">DAY</td><td style="text-align:left;">DAY(date: date) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns a number corresponding to the day in the month of the specified date.</td></tr><tr><td style="text-align:left;">DAYS</td><td style="text-align:left;">DAYS(date1: date, date2: date) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the number of days between two dates.</td></tr><tr><td style="text-align:left;">EARLIER</td><td style="text-align:left;">EARLIER(date1: date, date2: date): Boolean</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns true is the first date is earlier than the second one, else returns false.</td></tr><tr><td style="text-align:left;">EQUAL</td><td style="text-align:left;">Returns true if the dates are equal, else returns false.</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns true if the dates are equal, else returns false.</td></tr><tr><td style="text-align:left;">EOMONTH</td><td style="text-align:left;">EOMONTH(date: date, count: number) \u2192 date</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the date of the last day of the month a specified number of months before or after the original date.</td></tr><tr><td style="text-align:left;">HOUR</td><td style="text-align:left;">HOUR(date: date) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns a number corresponding to the hour of the specified date.</td></tr><tr><td style="text-align:left;">LATER</td><td style="text-align:left;">ISAFTER(date1: date, date2: date): Boolean</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns true is the first date is later than the second one, else returns false.</td></tr><tr><td style="text-align:left;">MINUTE</td><td style="text-align:left;">MINUTE(date: date) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns a number corresponding to the minutes of the specified date.</td></tr><tr><td style="text-align:left;">MONTH</td><td style="text-align:left;">MONTH(date: date) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns a number corresponding to the month of the specified date.</td></tr><tr><td style="text-align:left;">MONTHS</td><td style="text-align:left;">MONTHS(date1: date, date2: date) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the number of months between two dates.</td></tr><tr><td style="text-align:left;">SECOND</td><td style="text-align:left;">SECOND(date: date) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns a number corresponding to the seconds of the specified date.</td></tr><tr><td style="text-align:left;">WEEKDAY</td><td style="text-align:left;">WEEKDAY(date: date, [start: number]) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns a number corresponding to the day in the week of the specified date.</td></tr><tr><td style="text-align:left;">WEEKNUM</td><td style="text-align:left;">WEEKNUM(date: date, [start: number]) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns a number corresponding to the week number in the year of the specified date.</td></tr><tr><td style="text-align:left;">YEAR</td><td style="text-align:left;">YEAR(date: date) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns a number corresponding to the year of the specified date.</td></tr><tr><td style="text-align:left;">YEARS</td><td style="text-align:left;">YEARS(date1: date, date2: date) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the number of years between two dates.</td></tr></tbody></table><h3 id="logic-functions" tabindex="-1">Logic functions <a class="header-anchor" href="#logic-functions" aria-hidden="true">#</a></h3><table><thead><tr><th style="text-align:left;">Function</th><th style="text-align:left;">Description</th></tr></thead><tbody><tr><td style="text-align:left;">AND</td><td style="text-align:left;">AND(condition1: Boolean, [condition2: Boolean, \u2026]) \u2192 Boolean</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns true if all conditions are true, else returns false.</td></tr><tr><td style="text-align:left;">FALSE</td><td style="text-align:left;">FALSE() \u2192 Boolean</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the false logical value.</td></tr><tr><td style="text-align:left;">IF</td><td style="text-align:left;">IF(condition: Boolean, result1: any, result2: any)</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the first result if the condition is true, else the second one.</td></tr><tr><td style="text-align:left;">IFS</td><td style="text-align:left;">IFS(condition1: Boolean, result1: any, [condition2: Boolean, result2: any, ...])</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the result associated to the first true condition.</td></tr><tr><td style="text-align:left;">NOT</td><td style="text-align:left;">NOT(condition: Boolean) \u2192 Boolean</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns false if the condition is true, else returns true.</td></tr><tr><td style="text-align:left;">OR</td><td style="text-align:left;">OR(condition1: Boolean, [condition2: Boolean, \u2026]) \u2192 Boolean</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns true if at least one parameter is true, else returns false.</td></tr><tr><td style="text-align:left;">SWITCH</td><td style="text-align:left;">SWITCH(comparativeValue: any, case1: any, value1: Boolean, [case2: any, value2: Boolean, \u2026, default: any])</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the result associated to the first case which is equal to the comparative value, or returns the default result.</td></tr><tr><td style="text-align:left;">TRUE</td><td style="text-align:left;">TRUE() \u2192 Boolean</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the true logical value.</td></tr></tbody></table><h3 id="numeric-functions" tabindex="-1">Numeric functions <a class="header-anchor" href="#numeric-functions" aria-hidden="true">#</a></h3><table><thead><tr><th style="text-align:left;">Function</th><th style="text-align:left;">Description</th></tr></thead><tbody><tr><td style="text-align:left;">ABS</td><td style="text-align:left;">ABS(n: number) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the absolute value of the specified number.</td></tr><tr><td style="text-align:left;">AVERAGE</td><td style="text-align:left;">AVERAGE(nb1: number, [nb2: number, \u2026]) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the average of the specified numbers.</td></tr><tr><td style="text-align:left;">CEILING</td><td style="text-align:left;">CEILING(n: number) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Rounds up a number to the nearest integer if it is a float number, else returns the specified number if it is an integer.</td></tr><tr><td style="text-align:left;">DIVIDE</td><td style="text-align:left;">DIVIDE(n1: number, [n2: number, \u2026]) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the result of the division of the specified numbers.</td></tr><tr><td style="text-align:left;">E</td><td style="text-align:left;">E() \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the Euler number.</td></tr><tr><td style="text-align:left;">EQUAL</td><td style="text-align:left;">EQUAL(n1: number, n2: number, [..]) \u2192 Boolean</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns true if the specified numbers are equal, else returns false.</td></tr><tr><td style="text-align:left;">FLOOR</td><td style="text-align:left;">FLOOR(n: number) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Rounds down a number to the nearest integer if it is a float number, else returns the specified number if it is an integer.</td></tr><tr><td style="text-align:left;">GREATER</td><td style="text-align:left;">GREATER(n1: number, n2: number, [\u2026]) \u2192 Boolean</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns true if the first number is greater than the second one, else returns false.</td></tr><tr><td style="text-align:left;">GREATEREQ</td><td style="text-align:left;">GREATEREQ(n1: number, n2: number, [\u2026]) \u2192 Boolean</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns true if the first number is greater than the second one or if the two numbers are equal, else returns false.</td></tr><tr><td style="text-align:left;">INT</td><td style="text-align:left;">INT(n: number) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Rounds the specified number to the nearest integer.</td></tr><tr><td style="text-align:left;">LESS</td><td style="text-align:left;">LESS(n1: number, n2: number, [\u2026]) \u2192 Boolean</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns true if the first number is lower than the second one, else returns false.</td></tr><tr><td style="text-align:left;">LESSEQ</td><td style="text-align:left;">LESSEQ(n1: number, n2: number, [\u2026]) \u2192 Boolean</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns true if the first number is lower than the second one or if the two numbers are equal, else returns false.</td></tr><tr><td style="text-align:left;">LOG</td><td style="text-align:left;">LOG(n: number, base: number) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the result of the logarithm function applied to the number with the specified base.</td></tr><tr><td style="text-align:left;">MAX</td><td style="text-align:left;">MAX(nb1: number, [nb2: number...]) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the largest number among the specified ones.</td></tr><tr><td style="text-align:left;">MIN</td><td style="text-align:left;">MIN(nb1: number, [nb2: number, \u2026]) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the smallest number among the specified ones.</td></tr><tr><td style="text-align:left;">MOD</td><td style="text-align:left;">MOD(n: number, divisor: number) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the remainder from the division of two numbers.</td></tr><tr><td style="text-align:left;">PI</td><td style="text-align:left;">PI() \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the PI number.</td></tr><tr><td style="text-align:left;">PRODUCT</td><td style="text-align:left;">PRODUCT(n1: number, [n2: number, \u2026]) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the result of the product of numbers.</td></tr><tr><td style="text-align:left;">ROUND</td><td style="text-align:left;">ROUND(n: number, digits: number) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Rounds a number to a specified number of digits.</td></tr><tr><td style="text-align:left;">SIGN</td><td style="text-align:left;">SIGN(n: number) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns -1 if the specified number is negative, 0 if it is a zero number and 1 if it is positive.</td></tr><tr><td style="text-align:left;">SQRT</td><td style="text-align:left;">SQRT(n: number) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the square root of the specified number.</td></tr><tr><td style="text-align:left;">SUBTRACT</td><td style="text-align:left;">SUBTRACT(n1: number, [n2: number, \u2026]) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the result of the subtraction of the specified numbers.</td></tr><tr><td style="text-align:left;">SUM</td><td style="text-align:left;">SUM(n1: number, [n2: number, \u2026]) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the result of the sum of the specified numbers.</td></tr><tr><td style="text-align:left;">UNEQUAL</td><td style="text-align:left;">UNEQUAL(n1: number, n2: number, [\u2026]) \u2192 Boolean</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns true if the specified numbers aren&#39;t equal, else returns false.</td></tr></tbody></table><h3 id="text-functions" tabindex="-1">Text functions <a class="header-anchor" href="#text-functions" aria-hidden="true">#</a></h3><table><thead><tr><th style="text-align:left;">Function</th><th style="text-align:left;">Description</th></tr></thead><tbody><tr><td style="text-align:left;">CONCAT</td><td style="text-align:left;">CONCAT(str1: string, [str2: string, \u2026]) \u2192 string</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the concatenation of the specified texts.</td></tr><tr><td style="text-align:left;">EXACT</td><td style="text-align:left;">EXACT(str1: string, [str2: string, \u2026]) \u2192 Boolean</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns true if the specified texts are equal, else returns false.</td></tr><tr><td style="text-align:left;">FIND</td><td style="text-align:left;">FIND(searchedString: string, searchAreaString: string, [startPos: number]) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the position of the first occurrence of the searched text inside the other text, or 0 if the searched text is not included in the other one.</td></tr><tr><td style="text-align:left;">LEFT</td><td style="text-align:left;">LEFT(str: string, count: number) \u2192 string</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the first characters of the text.</td></tr><tr><td style="text-align:left;">LEN</td><td style="text-align:left;">LEN(str: string) \u2192 number</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the length of the text.</td></tr><tr><td style="text-align:left;">LOWER</td><td style="text-align:left;">LOWER(str: string) \u2192 string</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns a lowercase copy of the text</td></tr><tr><td style="text-align:left;">MID</td><td style="text-align:left;">MID(str: string, startPos: number, count: number) \u2192 string</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns a specific number of characters from a given position of the specified text.</td></tr><tr><td style="text-align:left;">REPLACE</td><td style="text-align:left;">REPLACE(originalString: string, startPos: number, count: number, pattern: string) \u2192 string</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns a copy of the original text in which a specific number of characters are replaced by a pattern from a given position.</td></tr><tr><td style="text-align:left;">REPT</td><td style="text-align:left;">REPT(str: string, n: number) \u2192 string</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns a text containing a specific number of times the original text.</td></tr><tr><td style="text-align:left;">RIGHT</td><td style="text-align:left;">RIGHT(str: string, count number) \u2192 string</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the last characters of the text.</td></tr><tr><td style="text-align:left;">SUBSTITUTE</td><td style="text-align:left;">SUBSTITUTE(searchedString: string, originalString: string, newString: string, [occurrenceIndex: number]) \u2192 string</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns a copy of the original text in which a pattern is replaced by a newer one.</td></tr><tr><td style="text-align:left;">TEXTJOIN</td><td style="text-align:left;">TEXTJOIN(separator: string, str1: string, [str2: string, \u2026]) \u2192 string</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns the concatenation of the specified texts, separated by a given separator.</td></tr><tr><td style="text-align:left;">TRIM</td><td style="text-align:left;">TRIM(str: string) \u2192 string</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns a copy of the original text without any spaces at the starting and the ending.</td></tr><tr><td style="text-align:left;">UPPER</td><td style="text-align:left;">UPPER(str: string) \u2192 string</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">Returns an uppercase copy of the text.</td></tr></tbody></table>`,38),a=[d];function i(s,f,o,u,g,y){return l(),e("div",null,a)}var c=t(r,[["render",i]]);export{h as __pageData,c as default};
