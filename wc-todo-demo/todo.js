(function () {
  var owner = (document.currentScript || {}).ownerDocument || document,
      items = [],
      todoProto = Object.create(HTMLElement.prototype, {
        addItem: {
          value: function (text) {
            items.push(text);
          }
        },

        removeItem: {
          value: function (id) {
            delete items[id];
          }
        },

        items: {
          get: function () { return items.slice(); }
        },

        createdCallback: {
          value: function () {
            var todos = this,
                shadow = this.createShadowRoot(),
                tmpl = owner.querySelector('template'),
                tmplBody = document.importNode(tmpl.content),
                addBtn;

            shadow.resetStyleInheritance = true;
            shadow.appendChild(tmplBody);

            addBtn = shadow.querySelector('#add-todo');
            addBtn.addEventListener('click', function () {
              var newTask = shadow.querySelector('#new-task');
              todos.addItem(newTask.value);
              newTask.value = '';
            });


            Object.observe(items, function (changes) {
              var list = shadow.querySelector('#tasks');

              changes.forEach(function (change) {
                var li;

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


  document.registerElement('x-todo', { prototype: todoProto });

})();
