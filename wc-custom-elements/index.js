(function () {

  window.onload = function () {
    ex1();
    ex2();
  };

  function ex1() {
    var root = document.querySelector('#ex1').shadowRoot,
        dog = root.querySelector('dog'),
        dogType = root.querySelector('#dog-type'),
        xDog = root.querySelector('x-dog'),
        xDogType = root.querySelector('#x-dog-type');

    dogType.innerText = Object.prototype.toString.apply(dog);
    xDogType.innerText = Object.prototype.toString.apply(xDog);
  }


  function ex2() {
    var root = document.querySelector('#ex2').shadowRoot,
        life = root.querySelector('#cats-life'),
        xCatProto = Object.create(HTMLElement.prototype, {
          nickName: { value: 'Cake', writable: true }
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

    root.querySelector('x-cat').setAttribute('friend', 'Fiona');
    root.querySelector('x-cat').meow();
    root.querySelector('x-cat').nickName = 'Caaaaake';
    root.querySelector('x-cat').meow();
    root.querySelector('x-cat').remove();
  }
})();
