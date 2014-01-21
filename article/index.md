# Web Components &mdash; это новый Web

> Спустя какое время стало ясно, что основная идея Prototype вошла в
> противоречие с миром.  Создатели браузеров ответили на возрождение
> Javascript добавлением новых API, многие из которых конфликтовали с
> реализацией Prototype.
>
> &mdash; Sam Stephenson, [You Are Not Your Code][1]

Создатели браузеров поступают очень гармонично. Решение о новых API
принимаются с учётом текущих трендов в opensource сообществах. Так
*prototype.js* способствовал появлению `Array.prototype.forEach`, `map` и
т.д., *jquery* вдохновил разработчиков на
`HTMLElement.prototype.querySelector` и `querySelectorAll`,
*underscore.js* (и многие другие) сделали возможным `Object.create()`.

Сейчас код на стороне клиента становится сложнее и объёмнее. Появляются
многочисленные фреймворки, которые помогают держать этот хаус под
контролем. *Backbone*, *ember*, *angular* и другие созданы, чтобы помочь
писать модульный, поддерживаемый код. Фреймворки уровня приложения &mdash;
это определённо тренд. Его дух присутсвует в JS среде давно. Не
удивительно, что создатели браузеров решили обратить на него внимание.

<habracut/>

**Web Components** &mdash; это **черновик** набора стандартов. Его
предложили и активно продвигают ребята из Google, но инициативу уже
поддержали в Mozilla. И Microsoft. Шучу, Microsoft вообще не при делах.
Мнения в комьюнити противоречивые (мне так кажется&hellip; судя по
комментариям, статьям и т.д.).

Основная идея в том, чтобы позволить программистам создавать виджеты.
Фрагменты приложения, изолированные от документа, в который они
встраиваются на столько, на сколько нужно автору и пользователю.

Я пару недель игрался с новыми API и уверен, что в каком-то виде, рано или
поздно эти возможности будут в браузерах. Хотя на данный момент реализация
в *Chrome Canary* порой ставила меня в тупик (меня, и сам Chrome Canary),
web components кажется тем инструментом, которого мне не хватало.

Результаты моих экспериментов послужили основой этой статьи. В ней я опишу
все основные части Web Components и покажу на примерах, как с ними
работать.

Стандарт Web Components описывает несколько API:

  * [Templates][templates]

    Фрагменты HTML, которые программист собирается использовать в каком-то
    моменте в будущем.

    Содержимое тегов &lt;template&gt; парсится
    браузером, но не вызывает выполнение скриптов и загрузку
    дополнительных ресурсов (изображений, аудио&hellip;) до того момента,
    пока оно не будет вставлено в документ.

  * [Shadow DOM][shadow-dom]

    Инструмент инкапсуляции HTML.

    Shadow DOM позволяет изменять внутренне представление HTML элементов,
    оставляя внешнее представление неизменным. Отличным примером являются
    элементы &lt;audio&gt; и &lt;video&gt;, при внешней простоте, на
    странице браузер отображает большое количество разных элементов
    (слайдеры, кнопки, окно проигрывателя). В Chrome эти и некоторые
    другие элементы используют Shadow DOM.

  * [Custom Elements][custom-elements]

    *Custom Elements* позволяют создавать и определять API собственных
    HTML элементов. Когда-нибудь мечтали о том, чтобы в HTML был тег
    &lt;menu&gt; или &lt;user-info&gt;?

  * [Imports](imports)

    API для импорта фрагментов разметки из других файлов.


На самом деле, в Web Components больше частей и маленьких деталей, я
перечислил только основные. Другие я ещё буду упоминать, до каких-то я
пока не добрался.

### Templates

Концепция шаблонов простая. Хотя под этим словом в стандарте
подразумевается не совсем то, к чему мы привыкли.

В современных web-фреймворках шаблоны &mdash; это строки или фрагменты
DOM, в которые мы подставляем данные перед тем как показать пользователю.

> В web components шаблоны &mdash; это фрагменты DOM, содержимое которых
> парсится но не выполняется до тех пор, пока не вставлено в документ.
> Картинки, аудио, видео не загружаются, скрипты не выполняются.

К примеру, такой фрагмент разметки в документе не вызовет загрузку
изображения.

      <template id="tmpl-user">
        <h2 class="name">Иван Иваныч</h2>
        <img src="photo.jpg">
      </template>

Браузер распарсит содержимое &lt;template&gt;, добраться до него можно с
помощью js:

    var tmpl = document.querySelector('#tmpl-user');
    // содержимое <template>
    var content = tmpl.content;
    var imported;

    // Подставляю данные в шаблон:
    content.querySelector('.name').innerText = 'Акакий';

    // Чтобы скопровать содержимое и сделать его частью документа,
    // используйте document.importNode()
    //
    // Это заставит браузер `выполнить` содержимое шаблона,
    // в данном случае начнёт грузится картинка `photo.jpg`
    imported = document.importNode(content);

    // Результат импорта вставляю в документ:
    document.body.appendChild(imported);

Пример работы шаблонов можно посмотреть [здесь][templates-demo]. Его как и
все остальные примеры в статье следует смотреть в [Chrome Canary][canary]
со включенными флагами:

* **Experimental Web Platform features**
* **Enable HTML Imports**

#### Для Чего?

На данный момент существует три способа работы с шаблонами:

1. Добавить шаблон в скрытый элемент на странице затем копировать его,
   подставляя данные:

        <div class="template" data-template="my-template">
          <p>Template Content</p>
          <img></img>
        </div>

    Минусы такого подхода в том, что браузер попытается "выполнить" код
    шаблона. То есть загрузить картинки, выполнить код скриптов и т.д.


2. Получать содержимое шаблона в виде строки (запросив AJAXом или из
   `<script type="x-template">`).

         <sctipt type="x-template" data-template="my-template">
           <p>Template Content</p>
           <img src="{{ image }}"></img>
         </script>

    Минус в том, что приходится работать со строками. Это может привести к
    XSS, нужно уделять дополнительное внимание экранированию.

3. Компилируемые шаблоны, вроде [hogan.js][hogan-js], также работают со
   строками. Значит они имеют тот же изъян, что и шаблоны второго типа.


Использования `<template>` лишено этих недостатков. Мы работаем с DOM, не
со строками. Когда выполнять код, также решать нам.


### Shadow DOM

Инкапсуляция. Этого в работе с разметкой мне не хватало больше всего. Что
такое Shadow DOM и как он работает проще всего понять на примере.

Когда мы используем html5 элемент &lt;audio&gt; код выглядит примерно так:

    <audio controls src="kings-speech"></audio>

Но на странице это выглядит так:

  ![audio element][audio-element-img]

Мы видим множество контролов, прогресбар, индикатор длины аудио. Откуда
эти элементы и как до них добраться. Ответ &mdash; все они находятся в
Shadow Tree элемента. Мы можем даже увидеть их в DevTools, если захотим.

> Чтобы Chrome в DevTools отображал содержимое Shadow DOM, в настройках
> DevTools, вкладка *General*, раздел *Elements* ставим галочку *Show Shadow
> DOM*.

 ![devtools shadow dom][devtools-shadow-img]


##### Теория Shadow DOM

*Shadow Tree* &mdash; это поддерево, которое прикрепренно к элементу в
документе. Элемент в этом случае называется *shadow host*, на его месте
браузер показывает содержимое *shadow tree*, игнорируя содержимое самого
элемента.

Именно это происходит с &lt;audio&gt; тегом в примере выше, на его месте
браузер рендерит содержимое *shadow tree*.

Откройте DevTools и посмотрите на пример [тут][audio-demo], чтобы
убедиться.

Одной из главных фишек shadow dom является то, что стили, определённые в
нём с помощью &lt;style&gt;, не распространяются на родительский документ.
Также у нас есть возможность ограничить влияние стилей, определённых в
родительском документе, на содержимое shadow tree.  Об этом позже.

##### Посадить теневое дерево

Web Components позволяет пользователям самостоятельно создавать и
манипулировать содержимым *shadow tree*. Напрмер:

    <div class="shadow-host">
      Этот текст пользователь не увидит.
    </div>

    <script>
      var shadowHost = document.querySelector('.shadow-host');
      var shadowRoot = shadowHost.createShadowRoot();

      shadowRoot.innerText = 'Он увидит этот текст.'
    </script>

[ссылка на пример][shadow-custom-1-demo].

#### Проекции, тег &lt;content&gt;

Мы можем `проецировать` содержимое хоста в shadow tree, с помощью тега
&lt;content&gt;.

> Важно, что &lt;content&gt; **проецирует** содержимое хоста, а не
> переносит его из хоста в shadow tree. Спроецированное содержимое
> остаётся на своём месте и на него распространяются стили **документа**
> (а не shadow tree). &lt;content&gt; это своего рода окно между мирами.

Пример:

    <template id="content-tag">
      <p>
        Это содержимое
        <strong>shadow tree</strong>.
      </p>
      <p>
        Ниже проекция содержимого
        <strong>shadow host</strong>:
      </p>
      <content></content>
    </template>

    <div class="shadow-host">
      <h1 class="name">Варлам</h1>
      <img src="varlam.png">
      <p class="description">Бодрый Пёс</p>
    </div>

    <script>
      var host = document.querySelector('.shadow-host'),
          template = document.querySelector('#content-tag'),
          shadow = host.createShadowRoot();

      shadow.appendChild(template.content);
    </script>

[ссылка на пример][shadow-custom-2-demo]

Результат будет выглядеть примерно так:

  ![content demo][content-demo-img]

С помощью тега &lt;content&gt; с атрибутом *select*, мы можем выбирать
фрагменты содержимого shadow host, например:

    <template id="content-select">
      <h1>Просто</h1>
      <content select=".description"></content>
      <content select=".name"></content>
    </template>

    <div class="shadow-host">
      <h1 class="name">Варлам</h1>
      <img src="varlam.png">
      <p class="description">Бодрый Пёс</p>
    </div>

    <script>
      var host = document.querySelector('.shadow-host'),
          template = document.querySelector('#content-select'),
          shadow = host.createShadowRoot();

      shadow.appendChild(template.content);
    </script>


[ссылка на пример][shadow-custom-3-demo]

Результат:

  ![content-select-demo][content-select-demo-img]

#### Стили в Shadow DOM

Инкапсуляция стилей &mdash; одна из основных фишек *shadow DOM*. Стили,
которые определёны в shadow tree имеют силу только внутри этого дерева.

Одна из досадных особенностей shadow dom &mdash; отсутствие возможности
использовать внешние css файлы. Надеюсь, это поправят в будущем.

Рассмотрим пример:

    <template id="color-green">
      <style>
        div { background-color: green; }
      </style>

      <div>зелёный</div>
    </template>

    <div class="shadow-host"></div>

    <script>
      var host = document.querySelector('.shadow-host'),
      template = document.querySelector('#color-green'),
      shadow = host.createShadowRoot();

      shadow.appendChild(template.content);
    </script>

Зелёный фон в примере получит только &lt;div&gt; внутри shadow tree. То
есть стили не вытекут в основной документ.

[ссылка на пример][shadow-style-1-demo]

Результат:

  ![green][shadow-style-1-img]

#### Селектор `:host`


Изменить стили хоста из shadow tree можно с помощью специального селектора
`:host`.

К примеру, в этом случае элемент `div.shadow-host` окрасится в цвет `aqua`:

    <template id="color-host">
      <style>
        :host { background-color: aqua; }
      </style>

      <content></content>
    </template>

    <div class="shadow-host">
      <p>Host Content</p>
    </div>

    <script>
      var host = document.querySelector('.shadow-host'),
      template = document.querySelector('#color-host'),
      shadow = host.createShadowRoot();

      shadow.appendChild(template.content);
    </script>

[ссылка на пример][shadow-style-2-demo]

Результат:

  ![host][shadow-style-2-img]

#### Наследуемые стили

По-умолчанию наследуемые стили, такие как `color`, `font-size` и
[другие][style-inheritance], **влияют** на содержимое shadow tree.
Мы избежим этого, установив `shadowRoot.resetStyleInheritance = true`:


    <template id="reset">
      <p>В этом примере шрифты сброшены.</p>

      <content></content>
    </template>

    <div class="shadow-host">
      <p>Host Content</p>
    </div>

    <script>
      var host = document.querySelector('.shadow-host'),
        template = document.querySelector('#reset'),
        shadow = host.createShadowRoot();

      shadow.resetStyleInheritance = true;
      shadow.appendChild(template.content);
    </script>

[ссылка на пример][shadow-style-3-demo]

Результат:

  ![inherit styles][shadow-style-3-img]

#### Авторские стили

Чтобы стили документа влияли на то, как выглядят элементы shadow tree,
используйте свойство `applyAuthorStyles`.

На примере:

    <template id="no-author-st">
      <div class="border">div.border</div>
    </template>

    <style>
      /* В стилях документа */
      .border {
        border: 3px dashed red;
      }
    </style>

    <div class="shadow-host"></div>


    <script>
      var host = document.querySelector('.shadow-host'),
          template = document.querySelector('#no-author-st'),
          shadow = host.createShadowRoot();

      shadow.applyAuthorStyles = false; // значение по-умолчанию
      shadow.appendChild(template.content);
    </script>

Изменяя значение `applyAuthorStyles`, получаю разный результат:

[ссылка на пример с applyAuthorStyles=false][shadow-style-4-demo]

[ссылка на пример с applyAuthorStyles=true][shadow-style-5-demo]

`applyAuthorStyles = false`

  ![no to author styles][shadow-style-4-img]

`applyAuthorStyles = true`

  ![yes to author styles][shadow-style-5-img]


#### Селекторы ^ и ^^

Инкапсуляция это здорово, но если мы всё таки хотим добраться до
shadow tree и изменить представление элементов из документа, нам
понадобится молоток. И кувалда.

Селектор `div ^ p` аналогичен `div p` с тем исключением, что он пересекает
одну теневую границу ( Shadow Boundary).

Селектор `div ^^ p` аналогичен `div p` аналогичен предыдущему, только пересекает ЛЮБОЕ количество границ теневого дерева.

    <template id="hat">
      <p class="shadow-p">
        Это красный текст.
      </p>
    </template>

    <style>
      /* В стилях документа */
      .shadow-host ^ p.shadow-p {
        color: red;
      }
    </style>

    <div class="shadow-host"></div>

    <script>
      var host = document.querySelector('.shadow-host'),
      template = document.querySelector('#hat'),
      shadow = host.createShadowRoot();

      shadow.appendChild(template.content);
    </script>

[ссылка на пример][shadow-style-6-demo]

Результат:

  ![cat in the hat][shadow-style-6-img]

#### Зачем нужен Shadow DOM?

Прежде всего, это альтернатива `iframe`. Последний изолирован слишком
сильно. Чтобы взаимодействовать со внешним документом, приходится
изобретать безумные способы передачи сообщений. Изменение внешнего
представления с помощью css просто невозможно.

В отличие от `iframe`, *Shadow DOM* &mdash; это часть вашего документа.
Если нужно, изменяйте его представление с помощью стилей, или ковыряйте
скриптом. Это даёт возможность сломать инкапсуляцию, но порой без этого
никак. Изобилие библиотек, которые решают проблему общения между фреймами
это подтверждает.

*Custom Elements* позволяют создавать API, которые инкапсулируют доступ к
*Shadow Tree*, избавляя пользователя виджета от работы с *Shadow DOM*
напрямую. Об этом дальше.

### Custom Elements

*Custom Elements* &mdash; это инструмент создания своих HTML элементов.
API этой части Web Components выглядит зрело и очень напоминает [директивы
Angular][angular-directives]. В сочитании с *Shadow DOM* и *шаблонами*,
кастомные элементы дают возможность создавать полноценные виджеты вроде
`<audio>`, `<video>` или `<input type="date">`.

Чтобы избежать конфликтов, согласно стандарту, кастомные элементы должны
содержать дефис в своём названии. По-умолчанию они наследуют
`HTMLElement`. Таким образом, когда браузер натыкается на разметку вида
`<my-super-element>`, он парсит его как `HTMLElement`. В случае
`<mysuperelement>`, результат будет `HTMLUnknownElement`.

    <dog></dog>
    <x-dog></x-dog>

    <dl>
      <dt>dog type</dt>
      <dd id="dog-type"></dd>
      <dt>x-dog type</dt>
      <dd id="x-dog-type"></dd>
    </dl>

    <script>
      var dog = document.querySelector('dog'),
          dogType = document.querySelector('#dog-type'),
          xDog = document.querySelector('x-dog'),
          xDogType = document.querySelector('#x-dog-type');

      dogType.innerText = Object.prototype.toString.apply(dog);
      xDogType.innerText = Object.prototype.toString.apply(xDog);
    </script>


[ссылка на пример][custom-el-1-demo]

Результат:

  ![x-dog][custom-el-1-img]


#### API кастомного элемента

Мы можем определять свойства и методы у нашего элемента. Такие, как метод
`play()` у элемента `<audio>`.

В жизненный цикл элемента входит 4 события, на каждое мы можем повесить
callback:

* created  &mdash;  создан инстанс элемента
* attached &mdash;  элемент вставлен в DOM
* detached &mdash;  элемент удалён из DOM
* attributeChanged &mdash; атрибут элемента добавлен, удалён или изменён

Все свойства, методы и колбеки определяются при создании протипа элемента.
Затем мы регистрируем элемент в DOM с помощью `document.registerElement()`.

    document.registerElement('my-element', {
      prototype: myElementPrototype
    });

Пример создания кастомного элемента с API:

    <x-cat></x-cat>
    <div>
      <strong>Cat's life:</strong>
      <pre id="cats-life"></pre>
    </div>

    <script>
      var life = document.querySelector('#cats-life'),
          xCatProto = Object.create(HTMLElement.prototype, {
            nickName: 'Cake', writable: true
          });

      xCatProto.meow = function () {
        life.innerText += this.nickName + ': meow\n';
      };

      xCatProto.createdCallback = function () {
        life.innerText += 'created\n';
      };

      xCatProto.attachedCallback = function () {
        life.innerText += 'attached\n';
      };

      xCatProto.detachedCallback = function () {
        life.innerText += 'detached\n';
      };

      xCatProto.attributeChangedCallback = function (name, oldVal, newVal) {
        life.innerText += (
          'Attribute ' + name +
          ' changed from ' + oldVal +
          ' to ' + newVal + '\n');
      };

      document.registerElement('x-cat', { prototype: xCatProto });

      document.querySelector('x-cat').setAttribute('friend', 'Fiona');

      document.querySelector('x-cat').meow();

      document.querySelector('x-cat').nickName = 'Caaaaake';
      document.querySelector('x-cat').meow();

      document.querySelector('x-cat').remove();
    </script>


[ссылка на пример][custom-el-2-demo]

Результат:

  ![cat's life][custom-el-2-img]


#### Зачем нужны Custom Elements?

*Custom Elements* это очередной шаг к семантической вёрстке. Программистам
важно создавать абстракции. Семантически-нейтральные `<div>` или `<ul>`
хорошо подходят для низкоуровневой вёрстки. Custom Elements позволит
писать модульный, удобочитаемый код.

*Shadow DOM* и *Custom Elements* дают возможность создавать независимые от
контескта виджеты, с удобным API и инкапсулированным внутрненним
представлением.

### HTML Imports

Импорты &mdash; простое API, которому, по-моему, давно место в браузерах.

    <link rel="import" href="widget.html">

    <sctipt>
      var link = document.querySelector('link[rel="import"]');

      // Доступ к импортированному документу происходит с помощью свойства
      // *import*.
      var importedContent = link.import;

      importedContent.querySelector('article');
    </sctipt>


### Object.observe()

Ещё одно приятное дополнение и часть Web Components (кажется), это API для
отслеживания изменений объекта `Object.observe()`.

Этот метод уже есть в Chrome с включенным экспериментальным JS.
Поиграемся с ним в консоли:

    var o = {};

    Object.observe(o, function (changes) {
      changes.forEach(function (change) {
        // change.object содержит изменённую версию объекта

        console.log('property:', change.name, 'type:', change.type);
      });
    });

    o.x = 1     // property: x type: add
    o.x = 2     // property: x type: update
    delete o.x  // property: x type: delete

При каждом изменении объекта `o` вызывается callback. В него передаётся
массив изменений, в каждом содержится название изменённого свойства, тип
изменения и сам изменённый объект.


### TODO widget

Согласно древней традиции, вооружившись полученными знаниями, я решил
сделать простой TODO-widget. Демо и код вы найдёте [здесь][todo-widget].
В нём используются все описанные части web components.

Добавление виджета на страницу сводится к одному импорту и одному тегу в
теле документа. По-моему, это очень круто.

    <html>
      <head>
        <link rel="import" href="todo.html">
      </head>
      <body>
        <x-todo></x-todo>
      </body>
    </html>

    <script>
      // JS API виджета:
      var xTodo = document.querySelector('x-todo');
      xTodo.items();                // список задач
      xTodo.addItem(taskText);      // добавить
      xTodo.removeItem(taskIndex);  // удалить
    </script>

  ![todo widget][todo-widget-img]


### Выводы

### Ссылки


[1]: http://sstephenson.us/posts/you-are-not-your-code
[templates]: http://www.w3.org/TR/components-intro/#template-section
[shadow-dom]: http://w3c.github.io/webcomponents/spec/shadow/
[custom-elements]: http://www.w3.org/TR/components-intro/#custom-element-section
[imports]: http://www.w3.org/TR/components-intro/#imports-section
[canary]: https://www.google.com/intl/en/chrome/browser/canary.html
[style-inheritance]: http://www.impressivewebs.com/inherit-value-css/
[hogan-js]: http://twitter.github.io/hogan.js/
[angular-directives]: http://docs.angularjs.org/guide/directive


[templates-demo]: http://filipovskii.github.io/web-components-demo/wc-templates/

[audio-demo]: http://filipovskii.github.io/web-components-demo/wc-shadowdom-audio/

[shadow-custom-1-demo]: http://filipovskii.github.io/web-components-demo/wc-shadowdom-custom/#1
[shadow-custom-2-demo]: http://filipovskii.github.io/web-components-demo/wc-shadowdom-custom/#2
[shadow-custom-3-demo]: http://filipovskii.github.io/web-components-demo/wc-shadowdom-custom/#3

[shadow-style-1-demo]: http://filipovskii.github.io/web-components-demo/wc-shadowdom-styles/#1
[shadow-style-2-demo]: http://filipovskii.github.io/web-components-demo/wc-shadowdom-styles/#2
[shadow-style-3-demo]: http://filipovskii.github.io/web-components-demo/wc-shadowdom-styles/#3
[shadow-style-4-demo]: http://filipovskii.github.io/web-components-demo/wc-shadowdom-styles/#3
[shadow-style-5-demo]: http://filipovskii.github.io/web-components-demo/wc-shadowdom-styles/#3
[shadow-style-6-demo]: http://filipovskii.github.io/web-components-demo/wc-shadowdom-styles/#3

[custom-el-1-demo]: http://filipovskii.github.io/web-components-demo/wc-custom-elements/#1
[custom-el-2-demo]: http://filipovskii.github.io/web-components-demo/wc-custom-elements/#2

[todo-widget]: http://filipovskii.github.io/web-components-demo/wc-todo-demo/


[audio-element-img]: http://habrastorage.org/storage3/94b/521/7b3/94b5217b32b9f31b14952f0845bfec7a.png
[devtools-shadow-img]: http://habrastorage.org/storage3/fa4/c0a/b5d/fa4c0ab5dd9786ec68ba620b74d16f05.png
[content-demo-img]: http://habrastorage.org/storage3/48f/f55/ba7/48ff55ba7ac47c137e7981344d5cfa36.png
[content-select-demo-img]: http://habrastorage.org/storage3/a6d/a0d/bf9/a6da0dbf91d6c34b536e79a94e21888f.png

[shadow-style-1-img]: http://habrastorage.org/storage3/92c/1ce/063/92c1ce063c1704dee8721e1d885f5fee.png
[shadow-style-2-img]: http://habrastorage.org/storage3/98d/973/4d3/98d9734d382eebba9ea663eb588b586b.png
[shadow-style-3-img]: http://habrastorage.org/storage3/6e0/39d/000/6e039d000cdb1fd91f8b4814bc18cb77.png
[shadow-style-4-img]: http://habrastorage.org/storage3/5a1/3a9/e51/5a13a9e5183bb7279330eb12f0b7646b.png
[shadow-style-5-img]: http://habrastorage.org/storage3/e31/775/9f5/e317759f57d941fcfc402acd0486187b.png
[shadow-style-6-img]: http://habrastorage.org/storage3/b09/75a/4d4/b0975a4d44e325b873005c85f4127245.png

[custom-el-1-img]: http://habrastorage.org/storage3/d9d/72d/5a3/d9d72d5a3279801de71c982933425f0a.png
[custom-el-2-img]: http://habrastorage.org/storage3/e2b/d5c/930/e2bd5c93064466d1a2bf3e9c3d3b5201.png

[todo-widget-img]: http://habrastorage.org/storage3/922/f03/f8d/922f03f8d14c931a67f813c5bf90b947.png
