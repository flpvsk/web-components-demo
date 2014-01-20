// # TODO Widget
//
// ## [ГЛАВНАЯ](../..) | [ДЕМО](..)
//
'.';

(function () {

  // Ссылка на документ с кодом виджета
  var owner = (document.currentScript || {}).ownerDocument || document,
      // Задачи
      items = [],
      // Прототип кастомного элемента наследует *HTMLElement*.
      todoProto = Object.create(HTMLElement.prototype, {

        // Добавить задачу в список.
        addItem: {
          value: function (text) {
            items.push(text);
          }
        },

        // Удалить задачу.
        removeItem: {
          value: function (id) {
            delete items[id];
          }
        },

        // Получить список.
        items: {
          get: function () { return items.slice(); }
        },

        // Callback будет вызван при добавлении &lt;x-todo&gt; элемента на
        // страницу.
        createdCallback: {
          value: function () {
            var todos = this,
                shadow = this.createShadowRoot(),
                tmpl = owner.querySelector('template'),
                tmplBody = document.importNode(tmpl.content),
                addBtn;

            // Виджет не будет наследовать стили документа, в который
            // встроен.
            shadow.resetStyleInheritance = true;
            shadow.appendChild(tmplBody);

            addBtn = shadow.querySelector('#add-todo');
            addBtn.addEventListener('click', function () {
              var newTask = shadow.querySelector('#new-task');

              // В обработчике вызываю метод `добавить задачу`,
              // определённый ранее.
              todos.addItem(newTask.value);
              newTask.value = '';
            });


            // `Object.observe` вызывет переданный callback на каждое
            // изменение `items`.
            Object.observe(items, function (changes) {
              var list = shadow.querySelector('#tasks');

              changes.forEach(function (change) {
                var li;

                // Если в список добавили задачу,
                // создаю соответсвующий &lt;li&gt;,
                // вешаю обработчик клика.
                if (change.type === 'add') {
                  li = document.createElement('li');
                  li.setAttribute('data-id', change.name);
                  li.innerText = change.object[change.name];
                  li.addEventListener('click', function () {
                    todos.removeItem(parseInt(change.name));
                  });
                  list.appendChild(li);
                  return;
                }

                // Если удалили, удаляю соответсвующий &lt;li&gt;.
                if (change.type === 'delete') {
                  li = list.querySelector(
                    '[data-id="' + change.name + '"]');
                  li.removeEventListener();
                  li.remove();
                  return;
                }

              });
            });
          }
        }
      });


  // Регистрирую кастомный элемент.
  document.registerElement('x-todo', { prototype: todoProto });

})();
