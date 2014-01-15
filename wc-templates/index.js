// # Пример использования тега &lt;template&gt;
//
// ## <a href="..">Демо</a>
// ## <a href="">Статья</a>
//
//
// Содержимое &lt;body&gt; на момент загрузки страницы:
//
// ```
// <div id="wait-for-it">
//   <h3>
//     Откройте вкладку Network в DevTools,
//     картика начнёт грузится
//     через <span id="seconds">3</span>...
//   </h3>
// </div>
// ```
// Тег &lt;template&gt; находится в &lt;head&gt; документа.  После
// загрузки, браузер парсит его содержимое, но больше ничего не делает.
// Картинки не загружаются, скрипты не запускаются до тех пор, пока
// content шаблона не вставлен в DOM.
//
// ```
// <template id="img-with-caption">
//   <h3>
//     Шаблон вставлен в DOM.
//     Котёнок загружен.
//     <a href="docs">Код</a>.
//   </h3>
//   <img src="bad-url"></img>
// </template>
// ```
//
'.';

//
(function () {


  //
  window.onload = function () {

    // Сохраняю ссылки на элементы.
    var seconds = 3,
        secondsEl = document.querySelector('#seconds'),
        template = document.querySelector('#img-with-caption'),
        waitForItEl = document.querySelector('#wait-for-it'),
        interval;

    // Раз в секунду, обновляю отсчёт.
    interval = setInterval(function () {
      var templateBody, imgEl;

      seconds -= 1;
      secondsEl.innerText = seconds;

      // Если пора...
      if (seconds <= 0) {
        clearInterval(interval);

        imgEl = template.content.querySelector('img');

        // Подставляю данные в шаблон.
        imgEl.src = 'kitten.jpeg';

        // Импортирую шаблон в DOM.
        // **После этого вызова картинка начнёт загружаться.**
        templateBody = document.importNode(template.content);

        // Изменяю содержимое &lt;body&gt; документа.
        document.body.replaceChild(templateBody, waitForItEl);
      }

    }, 1000)

  };

})();
