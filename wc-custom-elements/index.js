(function () {

  var clearWS = function (text) {
    var min = 0,
        start = /^\s+/,
        end = /\s+$/,
        lines = text.split('\n'),
        match,
        i, l;


    for (i = 0, l = lines.length; i < l; i++) {
      lines[i] = lines[i].replace(end, '');

      if (lines[i].length === 0) {
        continue;
      }

      match = lines[i].match(start);

      if (!match) {
        return text;
      }

      if (min === 0) {
        min = match[0].length;
        continue;
      }

      if (match[0].length < min) {
        min = match[0].length;
      }
    }

    if (min === 0) { return text; }

    lines = lines.map(function (line) {
      return line.slice(min);
    });

    return lines.join('\n');
  };

  window.onload = function () {

    var wcExampleProto = Object.create(HTMLElement.prototype);

    wcExampleProto.createdCallback = function () {
      var tmpl = document.querySelector('#wc-example-tmpl'),
          tmplBody = document.importNode(tmpl.content, true),
          markupHolder = tmplBody.querySelector('[data-code=markup]'),
          markupEl = this.querySelector('wc-markup'),
          jsHolder = tmplBody.querySelector('[data-code=js]'),
          jsEl =  this.querySelector('wc-script'),
          tmplHolder = tmplBody.querySelector('[data-code=tmpl]'),
          tmplEl =  this.querySelector('template'),
          shadow = this.createShadowRoot(),
          previewHolder = tmplBody.querySelector('.preview'),
          previewContent,
          s, i, l;

      if (markupEl) {
        markupHolder.innerText = clearWS(markupEl.innerHTML);
        hljs.highlightBlock(markupHolder);
      }

      if (jsEl) {
        jsHolder.innerText = clearWS(jsEl.innerHTML);
        hljs.highlightBlock(jsHolder);
      }

      if (tmplEl) {
        s = tmplEl.outerHTML.split('\n')[0];
        s = s + clearWS(tmplEl.innerHTML).split('\n').map(function (l) {
          if (l.length === 0) { return l; }
          return '  ' + l;
        }).join('\n');
        s = s + '</template>';
        tmplHolder.innerText = s;
        hljs.highlightBlock(tmplHolder);
      }

      shadow.appendChild(tmplBody);
      shadow.applyAuthorStyles = true;


      for (i = 0, l = markupEl.childElementCount; i < l; i++) {
        previewHolder.appendChild(markupEl.children[i].cloneNode(true));
      }

      previewHolder
        .querySelector('.shadow-host')
        .createShadowRoot()
        .appendChild(tmplEl.content);
    };

    document.registerElement('wc-markup', {
      prototype: Object.create(HTMLElement.prototype)
    });

    document.registerElement('wc-script', {
      prototype: Object.create(HTMLElement.prototype)
    });

    document.registerElement('wc-example', {
      prototype: wcExampleProto
    });

  };
})();
