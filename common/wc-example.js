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


  var wcExampleProto = Object.create(HTMLElement.prototype),
      owner = document.currentScript.ownerDocument || document;


  wcExampleProto.createdCallback = function () {
    var tmpl = owner.querySelector('#wc-example-tmpl'),
        tmplBody = document.importNode(tmpl.content, true),
        markupHolder = tmplBody.querySelector('[data-code=markup] code'),
        markupEl = this.querySelector('wc-markup'),
        jsHolder = tmplBody.querySelector('[data-code=js] code'),
        jsEl =  this.querySelector('wc-script'),
        tmplHolder = tmplBody.querySelector('[data-code=tmpl] code'),
        tmplEl =  this.querySelector('template'),
        shadow = this.createShadowRoot(),
        previewHolder = tmplBody.querySelector('.preview'),
        previewShadow,
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

    previewShadow = previewHolder
      .querySelector('.shadow-host')
      .createShadowRoot();
    previewShadow.appendChild(tmplEl.content);

    if (this.dataset.hasOwnProperty('resetStyleInheritance')) {
      previewShadow.resetStyleInheritance = true;
    }

    if (this.dataset.hasOwnProperty('applyAuthorStyles')) {
      previewShadow.applyAuthorStyles = true;
    }
  };

  /*
  [ document, owner ].forEach(function (doc, i) {

    if (!doc) {
      console.warn('Document absent', i);
    }

    console.log('Registering');

    doc.registerElement('wc-markup', {
      prototype: Object.create(HTMLElement.prototype)
    });

    doc.registerElement('wc-script', {
      prototype: Object.create(HTMLElement.prototype)
    });

    doc.registerElement('wc-example', {
      prototype: wcExampleProto
    });

  });
  */


  document.registerElement('wc-markup', {
    prototype: Object.create(HTMLElement.prototype)
  });

  document.registerElement('wc-script', {
    prototype: Object.create(HTMLElement.prototype)
  });

  document.registerElement('wc-example', {
    prototype: wcExampleProto
  });


})();
