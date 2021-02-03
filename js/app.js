const ItemCtrl = (function () {
  // Item constructor
  let Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  //   Data for ItemCtrl
  let data = {
    items: [],
    totalCalories: 0,
    currentItem: null,
  };

  //   Create new item object and push it to the data.items
  const createNewItem = (food, calories) => {
    let newId;
    // create an id based on the items array length
    if (data.items.length > 0) {
      newId = data.items[data.items.length - 1].id + 1;
    } else {
      newId = 0;
    }
    // create a new item object with param value
    const item = new Item(parseInt(newId), food, parseInt(calories));
    // push the new object to array
    data.items.push(item);
    // return the item
    return item;
  };

  return {
    //   call create new item
    addItem: function (food, calories) {
      return createNewItem(food, calories);
    },
    // set current item
    setCurrentItem: function (id) {
      // filter the array to get the selected item
      const item = data.items.filter((item) => item.id === id);
      // set the current item to the selected item
      data.currentItem = item[0];
      // return the currentItem
      return data.currentItem;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    // get total calories
    getTotalCalories: function () {
      let total = 0;
      // loop through the whole array
      if (data.items.length > 0) {
        data.items.forEach((item) => {
          // add every item calories value to total
          total += item.calories;
        });
      }
      // set totalCalories to total
      data.totalCalories = total;
      return total;
    },
    editItem: function (input) {
      const { food, calories } = input;

      let updatedItem;
      // loop through the whole array
      data.items.forEach((item) => {
        // if the item same as the currentItem
        if (item.id == data.currentItem.id) {
          // set item value to the new value
          item.name = food;
          item.calories = parseInt(calories);
          this.getTotalCalories();
          updatedItem = item;
        }
      });

      return updatedItem;
    },
    deleteItem: function () {
      data.items = data.items.filter((item) => item.id !== data.currentItem.id);
    },
    clearItems: function () {
      data.items = [];
      data.totalCalories = 0;
    },
    // return data
    getData: function () {
      return data;
    },
  };
})();

const UICtrl = (function () {
  // all the element selectors needed
  let selectors = {
    tableBody: "#food__table_body",
    tableBodyRow: "#food__table_body tr",
    foodName: "#food-name",
    foodCalories: "#food-calories",
    add: "#add",
    edit: "#edit",
    deleteBtn: "#delete",
    goback: "#goback",
    clear: "#clear",
    empty: "#food-empty",
    foodTable: "#food-table",
    totalCalories: ".food_total_calories",
  };

  return {
    //   populate table with items data
    populateItems: function (items) {
      // set the table body to display block
      this.showTable();
      let html = "";
      // loop through items and create a new table row with each item value
      items.forEach((item) => {
        html += `
                    <tr id=${item.id}>
                        <td>${item.id + 1}.</td>
                        <td>${item.name}</td>
                        <td>${item.calories}</td>
                        <td>
                            <div class="button"><i class="fas fa-pencil-alt"></i></div>
                        </td>
                    </tr>
                `;
        // set table body to the html value
        document.querySelector(selectors.tableBody).innerHTML = html;
      });
    },
    // add row element
    addRow: function (item) {
      this.showTable();
      const tr = document.createElement("tr");
      tr.id = item.id;
      tr.innerHTML = `
              <td>${item.id + 1}.</td>
              <td>${item.name}</td>
              <td>${item.calories}</td>
              <td>
                  <div class="button"><i class="fas fa-pencil-alt edit-btn"></i></div>
              </td>
          `;
      //   console.log(tr);
      document
        .querySelector(selectors.tableBody)
        .insertAdjacentElement("beforeend", tr);
    },
    editRow: function (item) {
      const rows = document.querySelectorAll(selectors.tableBodyRow);
      let id;
      Array.from(rows).forEach((row) => {
        id = parseInt(row.getAttribute("id"));
        if (id === item.id) {
          document.getElementById(id).innerHTML = `
            <td>${item.id + 1}.</td>
            <td>${item.name}</td>
            <td>${item.calories}</td>
            <td>
                <div class="button"><i class="fas fa-pencil-alt edit-btn"></i></div>
            </td>
          `;
        }
      });
    },
    deleteRow: function (item) {
      const rows = document.querySelectorAll(selectors.tableBodyRow);

      Array.from(rows).forEach((row) => {
        id = parseInt(row.getAttribute("id"));

        if (id === item.id) {
          if (Array.from(rows).length === 1) {
            this.hideTable();
          }
          document.getElementById(id).remove();
        }
      });
    },
    clearRows: function () {
      const rows = document.querySelectorAll(selectors.tableBodyRow);

      Array.from(rows).forEach((row) => {
        document.getElementById(row.id).remove();
      });
    },
    // return value from input elements
    getInputValue: function () {
      const food = document.querySelector(selectors.foodName).value;
      const calories = document.querySelector(selectors.foodCalories).value;
      return { food, calories };
    },
    // empty input
    emptyInput: function () {
      document.querySelector(selectors.foodName).value = "";
      document.querySelector(selectors.foodCalories).value = "";
    },
    // fill input with current item
    displayInput: function (item) {
      document.querySelector(selectors.foodName).value = item.name;
      document.querySelector(selectors.foodCalories).value = item.calories;
    },
    // empty table
    hideTable: function () {
      document.querySelector(selectors.empty).classList.remove("fade-out");
      document.querySelector(selectors.tableBody).classList.remove("fade-in");
      document.querySelector(selectors.empty).classList.add("fade-in");
      document.querySelector(selectors.tableBody).classList.add("fade-out");
    },
    // show table
    showTable: function () {
      document.querySelector(selectors.empty).classList.remove("fade-in");
      document.querySelector(selectors.tableBody).classList.remove("fade-out");
      document.querySelector(selectors.empty).classList.add("fade-out");
      document.querySelector(selectors.tableBody).classList.add("fade-in");
    },
    initState: function () {
      // Remove all the fadein or fadeout class
      document.querySelector(selectors.add).style.display = "block";
      document.querySelector(selectors.deleteBtn).style.display = "none";
      document.querySelector(selectors.edit).style.display = "none";
      document.querySelector(selectors.goback).style.display = "none";
    },
    editState: function () {
      // Remove all the fadein or fadeout class
      document.querySelector(selectors.add).style.display = "none";
      document.querySelector(selectors.deleteBtn).style.display = "block";
      document.querySelector(selectors.edit).style.display = "block";
      document.querySelector(selectors.goback).style.display = "block";
    },
    displayCalories: function (totalCalories) {
      document.querySelector(
        selectors.totalCalories
      ).textContent = totalCalories;
    },
    // return selector
    getSelectors: function () {
      return selectors;
    },
  };
})();

const app = (function () {
  // add eventlistener to ui elements
  const loadEventListener = function () {
    const {
      add,
      tableBody,
      edit,
      deleteBtn,
      goback,
      clear,
    } = UICtrl.getSelectors();
    document.querySelector(add).addEventListener("click", addItem);
    document.querySelector(tableBody).addEventListener("click", editItem);
    document.querySelector(edit).addEventListener("click", submitEdit);
    document.querySelector(deleteBtn).addEventListener("click", deleteSubmit);
    document.querySelector(goback).addEventListener("click", cancelEdit);
    document.querySelector(clear).addEventListener("click", clearItems);
  };
  //   add new item from the input value
  const addItem = function () {
    // get input value from input field
    const input = UICtrl.getInputValue();
    // check if the input field is not empty
    if (input.food && input.calories) {
      // add input item to the itemList
      const item = ItemCtrl.addItem(input.food, input.calories);
      // update total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.displayCalories(totalCalories);
      // add row to the table with input value item
      UICtrl.addRow(item);
    }

    UICtrl.emptyInput();
  };

  const editItem = function (e) {
    if (e.target.classList.contains("edit-btn")) {
      // change the state to edit state
      UICtrl.editState();
      // get the id from tr element
      const id = e.target.parentNode.parentNode.parentNode.id;
      // set currentItem to the selected item
      const currentItem = ItemCtrl.setCurrentItem(parseInt(id));
      // display the selected item value to the input field
      UICtrl.displayInput(currentItem);
    }
  };

  const submitEdit = function (e) {
    // get input value
    const input = UICtrl.getInputValue();
    // update the selected item value from input
    const updateditem = ItemCtrl.editItem(input);
    // edit the selected product row element
    UICtrl.editRow(updateditem);
    // update total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.displayCalories(totalCalories);
    // empty input
    UICtrl.emptyInput();
    // change the state to init state
    UICtrl.initState();
  };

  const cancelEdit = function (e) {
    // empty input
    UICtrl.emptyInput();
    // change the state to init state
    UICtrl.initState();
  };

  const deleteSubmit = function (e) {
    // Delete item from data.items array
    ItemCtrl.deleteItem();
    // get current item
    const ItemToDelete = ItemCtrl.getCurrentItem();
    // delete the item element
    UICtrl.deleteRow(ItemToDelete);
    // update new calories
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.displayCalories(totalCalories);
    // empty the input field
    UICtrl.emptyInput();
    UICtrl.initState();
  };

  const clearItems = function (e) {
    // empty the items array
    ItemCtrl.clearItems();
    // get new calories
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.displayCalories(totalCalories);
    // delete rows
    UICtrl.clearRows();
    // hide table
    UICtrl.hideTable();
  };

  return {
    init: function () {
      const data = ItemCtrl.getData();
      if (data.items.length === 0) {
        UICtrl.hideTable();
      } else {
        UICtrl.populateItems(data.items);
      }

      UICtrl.initState();
      loadEventListener();
    },
  };
})(ItemCtrl, UICtrl);

app.init();
