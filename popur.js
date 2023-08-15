const submit = document.getElementById("submit");
const clear = document.getElementById("clear");
const nodeList = document.getElementById("noteList");
const newNote = document.getElementById("newNote");

// set default items
function checkOldData() {
  getData(function (data) {
    let listItem = "";
    data.forEach((item) => {
      listItem += ` <li class="list-group-item d-flex justify-content-between">
              <h5>${item.name}</h5>
              <button type="button" class="btn-close" aria-label="Close" denamicId="${item.id}"></button>  
          </li>`;
    });
    nodeList.innerHTML = listItem;
  });
}
checkOldData();

//add item
submit.addEventListener("click", async () => {
  if (newNote.value === "") return;
  let id = Date.now();
  let listItem = ` <li class="list-group-item d-flex justify-content-between">
      <h5>${newNote.value}</h5>
      <button type="button" class="btn-close" aria-label="Close" denamicId="${id}"></button>  
    </li>`;
  nodeList.innerHTML = nodeList.innerHTML + listItem;
  saveData(newNote.value, id);
  newNote.value = "";
});

//clear all item
clear.addEventListener("click", async () => {
  if (confirm("clear data ?")) {
    chrome.storage.local.clear(function () {
      nodeList.innerHTML = "";
    });
  }
});

// dalete item
function deleteItem(id) {
    console.log(id);
  let datas = [];
  getData(function (data) {
    data.forEach((item) => {
      if (Number(item.id) === Number(id)) {
        return;
      }
      datas.push(item);
    });
  });
  chrome.storage.local.set({ myData: datas });
  checkOldData();
}

//save item to storage
function saveData(data, id) {
  chrome.storage.local.get(["myData"], function (result) {
    let savedData = result.myData || [];
    savedData.push({ name: data, id: id });
    chrome.storage.local.set({ myData: savedData });
  });
}

//get all item to storage
function getData(callback) {
  chrome.storage.local.get(["myData"], function (result) {
    let savedData = result.myData || [];
    if (callback) {
      callback(savedData);
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const deleteBtns = document.querySelectorAll(".btn-close");
  deleteBtns.forEach((item) => {
    item.addEventListener("click", function (e) {
      deleteItem(e.target.getAttribute("denamicId"));
    });
  });
});
