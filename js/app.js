const ItemCtrl = (function () {
  // Item constructor
  let Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  //   Data for ItemCtrl
  let data = {
    items: [
      //   { id: 0, name: "Hamburger", calories: 1500 },
      //   { id: 1, name: "Chicken Curry", calories: 1200 },
      //   { id: 2, name: "Cookie", calories: 300 },
    ],
    totalCalories: 0,
    currentItem: null,
  };

  //   Create new item object and push it to the data.items
  const createNewItem = (food, calories) => {
    let newId;
    if (data.items.length > 0) {
      newId = data.items[data.items.length - 1].id + 1;
    } else {
      newId = 0;
    }
    // console.log(newId);
    const item = new Item(parseInt(newId), food, parseInt(calories));
    data.items.push(item);
    return item;
  };

  return {
    //   call create new item
    addItem: function (food, calories) {
      console.log("here");
      return createNewItem(food, calories);
    },
    // set current item
    setCurrentItem: function (id) {
      const item = data.items.filter((item) => item.id === id);
      data.currentItem = item;
      return data.currentItem;
    },
    // get total calories
    getTotalCalories: function () {
      let total = 0;
      data.items.forEach((item) => {
        total += item.calories;
      });
      //   console.log(total);
      data.totalCalories = total;
      return total;
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
    foodName: "#food-name",
    foodCalories: "#food-calories",
    add: "#add",
    edit: "#edit",
    delete: "#delete",
    goback: "#goback",
    empty: "#food-empty",
    foodTable: "#food-table",
    totalCalories: ".food_total_calories",
  };

  return {
    //   populate table with items data
    populateItems: function (items) {
      this.showTable();
      let html = "";

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
      document.querySelector(selectors.delete).style.display = "none";
      document.querySelector(selectors.edit).style.display = "none";
      document.querySelector(selectors.goback).style.display = "none";
    },
    editState: function () {
      // Remove all the fadein or fadeout class
      document.querySelector(selectors.add).style.display = "none";
      document.querySelector(selectors.delete).style.display = "block";
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
    const { add, tableBody } = UICtrl.getSelectors();
    document.querySelector(add).addEventListener("click", addItem);
    document.querySelector(tableBody).addEventListener("click", editItem);
  };
  //   add new item from the input value
  const addItem = function () {
    const input = UICtrl.getInputValue();
    if (input.food && input.calories) {
      const item = ItemCtrl.addItem(input.food, input.calories);
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.displayCalories(totalCalories);
      UICtrl.addRow(item);
    }

    UICtrl.emptyInput();
  };

  const editItem = function (e) {
    if (e.target.classList.contains("edit-btn")) {
      UICtrl.editState();
      const id = e.target.parentNode.parentNode.parentNode.id;
      //   console.log(id);
      const currentItem = ItemCtrl.setCurrentItem(parseInt(id));
      UICtrl.displayInput(...currentItem);
    }
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
