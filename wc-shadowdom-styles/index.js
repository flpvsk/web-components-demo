// #
// ## [ГЛАВНАЯ](../..) | [ДЕМО](..)
'.';


(function () {

  window.onload = function () {
    var templates = document.querySelectorAll('template'),
        shadowHost = document.querySelector('.shadow-host'),
        contentEl = document.querySelector('.content'),
        i, l;

    // Для каждого шаблона...
    for (i = 0, l = templates.length; i < l; i++) {
      var template = templates.item(i),
          templateBody = document.importNode(template.content),
          shadowHostClone = shadowHost.cloneNode(true),
          pEl = document.createElement('p'),
          templatePreEl = document.createElement('pre'),
          templateHeaderEl = document.createElement('h3'),
          shadowRoot;

      // Создаю <strong>Shadow Root</strong> для элемента,
      // который будет содержать <strong>Shadow DOM</strong>.
      // Сам элемент таким образом становится
      // <strong>Shadow Host</strong>.
      shadowRoot = shadowHostClone.createShadowRoot();

      // Заполняю заголовок.
      templateHeaderEl.innerText = (i + 1) + '. #' + template.id;
      // Вставляю превью шаблона.
      templatePreEl.innerText = template.innerHTML;

      pEl.appendChild(templateHeaderEl);
      pEl.appendChild(templatePreEl);

      // Добавляю содержимое шаблона в <strong>Shadow DOM</strong> хоста.
      shadowRoot.appendChild(templateBody);

      if (template.className.indexOf('reset-style-inheritance') >= 0) {
        // По-умолчанию наследуемые стили, такие как <code>color</code>,
        // <code>font-size</code> и
        // [другие](http://www.impressivewebs.com/inherit-value-css/),
        // имеют влияние на <strong>Shadow DOM</strong>.
        //
        // <code>resetStyleInheritance</code> позволит этого избежать.
        shadowRoot.resetStyleInheritance = true;
      }

      if (template.className.indexOf('apply-author-styles') >= 0) {
        // Свойство <code>applyAuthorStyles</code> позволяет авторским
        // стилям проникнуть в <strong>Shadow DOM</strong>.
        shadowRoot.applyAuthorStyles = true;
      }

      // Добавляю описание шаблона на страницу.
      contentEl.appendChild(pEl);
      // И сам элемент, хост, туда же.
      contentEl.appendChild(shadowHostClone);
    }

  };

})();
