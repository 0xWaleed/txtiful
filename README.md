# txtiful

A standalone library to apply colors to part of your text
using a simple syntax.

input: `normal [red](red-text) normal [blue] rest of text are blue.`  
output html:
```html
normal <span style="color:red;">red-text</span> normal <span style="color:blue;"> rest of text are blue.</span>
```
output:
normal <span style="color:red;">red-text</span> normal <span style="color:blue;"> rest of text are blue.</span>

## Installation
### NPM
`npm i txtiful-js`
###
```html
<script src="https://unpkg.com/txtiful-js"></script>
```

## Code Example:
```js
const {txtiful} = require("txtiful-js");
const html = txtiful("normal [red](red-text) normal [blue] rest of text are blue.");
element.write(html);
```
