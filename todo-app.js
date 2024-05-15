(function () {

  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    localTitle = cyrb53(title);
    return appTitle;
  }

  // тайтл захешировал и подставил хэш сумму как ключ.

  const cyrb53 = function (str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  };

  function createTodoItemForm() {
    let form = document.createElement('form')
    let input = document.createElement('input')
    let buttonWrapper = document.createElement('div')
    let button = document.createElement('button')

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.disabled = true;

    input.addEventListener('input', function () {
      if (input.value.length > 0) {
        button.disabled = false;
      } else {
        button.disabled = true;
      }
    });

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem(name, done = false, startBool = false) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    if (done === true) {
      item.classList.toggle('list-group-item-success');
    }

    if (myStorage.getItem(localTitle) === null) {
      myStorage.setItem(localTitle, JSON.stringify([{ name: name, done: done }]));
    } else {
      local = myStorage.getItem(localTitle);
      localArr = JSON.parse(local);

      alreadyOn = false;

      if (startBool === true) {
        localArr.forEach(element => {
          if (name === element.name) {
            alreadyOn = true;
          }
        });
      }

      if (alreadyOn === false) {
        localArr.push({ name: name, done: done });
        localStr = JSON.stringify(localArr);
        myStorage.setItem(localTitle, localStr);
      }
    }

    return {
      item,
      doneButton,
      deleteButton,
    }
  }

  function saveStatus(name) {
    local = myStorage.getItem(localTitle);
    localArr = JSON.parse(local);

    breakCircle = false;
    localArr.forEach(element => {
      if (element.name === name && breakCircle === false) {
        element.done = !element.done;
        breakCircle = true;
      }
    });

    localStr = JSON.stringify(localArr);
    myStorage.setItem(localTitle, localStr);

  }

  function deleteItemLocal(name) {
    local = myStorage.getItem(localTitle);
    localArr = JSON.parse(local);


    for (let index = 0; index < localArr.length; index++) {
      obj = localArr[index];
      if (obj.name === name) {
        localArr.splice(index, 1);
      }
    }

    localStr = JSON.stringify(localArr);
    myStorage.setItem(localTitle, localStr);

  }

  function createTodoApp(container, title = 'Список дел', startTodoItems = []) {
    myStorage = window.localStorage;
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    local = myStorage.getItem(localTitle);
    localArr = JSON.parse(local);
    if (local !== null) {
      localArr.forEach(element => {
        let todoItem = createTodoItem(element.name, element.done, true);

        todoItem.doneButton.addEventListener('click', function () {
          saveStatus(element.name);
          todoItem.item.classList.toggle('list-group-item-success');
        });

        todoItem.deleteButton.addEventListener('click', function () {
          if (confirm('Вы уверены?')) {
            deleteItemLocal(element.name);
            todoItem.item.remove();
          }
        });

        todoList.append(todoItem.item);
      });
    }

    if (local == null) {
      startTodoItems.forEach(element => {
        let todoItem = createTodoItem(element.name, element.done, true);

        todoItem.doneButton.addEventListener('click', function () {
          saveStatus(element.name);
          todoItem.item.classList.toggle('list-group-item-success');
        });

        todoItem.deleteButton.addEventListener('click', function () {
          if (confirm('Вы уверены?')) {
            deleteItemLocal(element.name);
            todoItem.item.remove();
          }
        });

        todoList.append(todoItem.item);
      });
    }

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    todoItemForm.form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!todoItemForm.input.value) {
        return;
      }
      nameNew = todoItemForm.input.value;


      let todoItem = createTodoItem(nameNew);

      location.reload();
      todoItem.doneButton.addEventListener('click', function () {
        saveStatus(nameNew);
        todoItem.item.classList.toggle('list-group-item-success');
      });

      todoItem.deleteButton.addEventListener('click', function () {
        if (confirm('Вы уверены?')) {
          deleteItemLocal(nameNew);
          todoItem.item.remove();
        }
      });

      todoList.append(todoItem.item);

      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true;
    });
  }

  window.createTodoApp = createTodoApp;

})();
