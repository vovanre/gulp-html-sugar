# gulp-html-sugar

Extendable html syntax sugar Gulp plugin.


## Install

Install with [npm](https://npmjs.org/)

```
npm install gulp-html-sugar --save-dev
```



## Example

#### gulpfile.js

```js
const htmlSugar = require('gulp-html-sugar');

return gulp.src('src/example.html').pipe(htmlSugar({
    'icon': function ($, element) {
        const iconName = element.html().trim();
        element.replaceWith($(`<svg class="icon ${iconName}"><use xlink:href="sprite.svg#${iconName}"/></svg>`));
     }
})).pipe(gulp.dest('build/'));
```

#### example.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Example page</title>
  </head>
  <body>
    <icon>trash</icon>
  </body>
</html>
```

#### Result:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Example page</title>
  </head>
  <body>
    <svg class="icon trash"><use xlink:href="sprite.svg#trash"/></svg>
  </body>
</html>
```



## API

### htmlSugar(options)

#### options.[selector]

Type: `function(document, element)`


`document` and `element` is [cheerio](https://www.npmjs.com/package/cheerio) objects.

## License

MIT © vovanre
