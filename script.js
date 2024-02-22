const addBtn = document.querySelector(".cnt");
const closeBtn = document.querySelector(".btn--close-modal");
const overlay = document.querySelector(".overlay");
const addWindow = document.querySelector(".add-window");
const uploadBtn = document.querySelector(".upload__btn");
const saveBtn = document.querySelector(".save__btn");
const clearLocal = document.querySelector(".clear");
const edit = document.querySelector(".edit-btn");
const deleteRow = document.querySelector(".delete-btn");
const ascending = document.querySelector("#ascending");
const descending = document.querySelector("#descending");
const sortDiv = document.querySelector(".sort");
const tableID = document.getElementById("tableID");
const tablePrice = document.getElementById("tablePrice");
const tableName = document.getElementById("tableName");
const upArrow = document.querySelector(".up");
const downArrow = document.querySelector(".down");
const upArr = document.querySelectorAll(".up");
const downArr = document.querySelectorAll(".down");

const toggleModal = function () {
  overlay.classList.toggle("hidden");
  addWindow.classList.toggle("hidden");
};
//open modal
addBtn.addEventListener("click", toggleModal);

//close modal
closeBtn.addEventListener("click", function () {
  toggleModal();
  location.reload();
});

//////////// upload modal description

uploadBtn.addEventListener("click", function (e) {
  e.preventDefault();

  let id = document.getElementById("id").value;
  let name = document.getElementById("name").value;
  let category = document.getElementById("category").value;
  let price = document.getElementById("price").value;
  let availability = document.getElementById("availability").value;

  if (id && name && category && price && availability != "") {
    //id condition for greater than 0
    if (id <= 0) {
      alert("Please enter valid ID");
      return;
    }

    if (availability != 0 && availability != 1) {
      alert("Please enter correct availability as 0 or 1");
      return;
    }

    const newRow = `
    <tr id='${id}' class='trial'>
      <td>${id}</td>
      <td>${name}</td>
      <td>${category}</td>
      <td>${price}</td>
      <td>${availability}</td>
      <td><button class='edit-btn' data-id='${id}'>Edit</button></td>
      <td><button class='delete-btn' data-id='${id}'>Delete</button></td>
    </tr>
    `;

    document
      .querySelector(".dataTable tbody")
      .insertAdjacentHTML("beforeend", newRow);

    ///id check if exist (unique id)
    const idExist = JSON.parse(localStorage.getItem("data")) || [];
    const uniqueId = idExist.some((unique) => unique.id === id);

    if (uniqueId) {
      alert("This ID already exist Try some another");
      return;
    }

    //
    overlay.classList.toggle("hidden");
    addWindow.classList.toggle("hidden");

    const data = JSON.parse(localStorage.getItem("data")) || [];
    data.push({ id, name, category, price, availability });
    localStorage.setItem("data", JSON.stringify(data));

    document.getElementById("id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("category").value = "";
    document.getElementById("price").value = "";
    document.getElementById("availability").value = "";
  } else {
    alert("Please fill up all the inputs first");
  }

  location.reload();
});

//// local storage load data
window.addEventListener("load", function () {
  const data = JSON.parse(localStorage.getItem("data")) || [];
  data.forEach((value) => {
    console.log(value);
    const newRow = `
      <tr id='${value.id}' class='trial'>
        <td>${value.id}</td>
        <td>${value.name}</td>
        <td>${value.category}</td>
        <td>${value.price}</td>
        <td>${value.availability}</td>
        <td><button class='edit-btn' data-id='${value.id}'>Edit</button></td>
        <td><button class='delete-btn' data-id='${value.id}'>Delete</button></td>
      </tr>
    `;

    document
      .querySelector(".dataTable tbody")
      .insertAdjacentHTML("beforeend", newRow); //afterend
  });
});

//clearing local storage
clearLocal.addEventListener("click", function () {
  clearLocal.classList.remove("hidden");
  localStorage.clear("data");
  location.reload();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("edit-btn")) {
    uploadBtn.classList.add("hidden");
    saveBtn.classList.remove("hidden");

    const row = event.target.closest("tr");
    const rowData = {
      id: row.cells[0].textContent,
      name: row.cells[1].textContent,
      category: row.cells[2].textContent,
      price: row.cells[3].textContent,
      availability: row.cells[4].textContent,
    };
    console.log(rowData.id.length);
    console.log(document.getElementById("id"));

    if (rowData.id.length > 0) {
      console.log("object");
      // document.getElementById("id").setAttribute = ("disabled", false);
      document.getElementById("id").disabled = true;
    }

    if (rowData && rowData.name && rowData.name.trim() !== "") {
      prefill(rowData);
      toggleModal();
    } else {
      console.error("Error: Product name is missing or empty.");
    }

    // Prefill form fields with row data and open modal for editing
    // prefill(rowData);
    // toggleModal();
  }
});

function prefill(rowData) {
  document.getElementById("id").value = rowData.id;
  document.getElementById("name").value = rowData.name;
  document.getElementById("category").value = rowData.category;
  document.getElementById("price").value = rowData.price;
  document.getElementById("availability").value = rowData.availability;
}

// Function to update row data by id in local storage
function updateRow(id, newData) {
  const data = JSON.parse(localStorage.getItem("data")) || [];
  const index = data.findIndex((item) => item.id === id);

  if (index !== -1) {
    data[index] = newData;

    // const updateOne = { ...data[index], ...newData };
    // console.log(updateOne, newData);
    // data[index] = updateOne;

    // data[index].name = newData.name;

    localStorage.setItem("data", JSON.stringify(data));
  }
}

saveBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const id = document.getElementById("id").value;
  const newName = document.getElementById("name").value;
  const newCategory = document.getElementById("category").value;
  const newPrice = document.getElementById("price").value;
  const newAvailability = document.getElementById("availability").value;

  // Update row data in local storage
  updateRow(id, {
    id,
    name: newName,
    category: newCategory,
    price: newPrice,
    availability: newAvailability,
  });

  // Update the corresponding row in the table
  const tableRow = document.querySelector(".trial");
  console.log(tableRow);
  if (tableRow) {
    // console.log("object");
    const cells = tableRow.querySelectorAll("td");
    cells[1].textContent = newName;
    cells[2].textContent = newCategory;
    cells[3].textContent = newPrice;
    cells[4].textContent = newAvailability;
  }

  location.reload();

  // Close the modal
  toggleModal();
});

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
// delete row
document.addEventListener("dblclick", function (event) {
  if (event.target.classList.contains("delete-btn")) {
    const row = event.target.closest("tr");
    if (row) {
      const id = row.id;

      row.remove();

      deleteRowClk(id);
    }
    location.reload();
  }
});

// Function to delete row from localStorage
function deleteRowClk(id) {
  const data = JSON.parse(localStorage.getItem("data")) || [];
  const newData = data.filter((item) => item.id !== id);
  localStorage.setItem("data", JSON.stringify(newData));
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

// Function to sort data by column in ascending order

// function sortingMethod(sortOrder, indexNo) {
//   const tableBody = document.querySelector(".dataTable tbody");

//   const rows = document.querySelectorAll(".trial");

//   const sortedRows = Array.from(rows).sort((a, b) => {
//     const aValue = a.cells[indexNo].textContent.trim();
//     const bValue = b.cells[indexNo].textContent.trim();
//     // if (sortOrder === "ascending") return aValue - bValue;
//     // if (sortOrder === "descending") return aValue - bValue;

//     return sortOrder === "ascending" ? aValue - bValue : bValue - aValue;
//   });

//   sortedRows.forEach((row) => {
//     tableBody.appendChild(row);
//   });
// }

function Ascending(indexNo) {
  const tableBody = document.querySelector(".dataTable tbody");

  // const rows = Array.from(tableBody.querySelectorAll(".trial"));
  const rows = document.querySelectorAll(".trial");

  const sortedRows = Array.from(rows).sort((a, b) => {
    const aValue = a.cells[indexNo].textContent.trim();
    const bValue = b.cells[indexNo].textContent.trim();
    // return aValue.localeCompare(bValue);
    return aValue - bValue;
  });

  console.log(tableBody);

  // tableBody.innerHTML = "";

  sortedRows.forEach((row) => {
    tableBody.appendChild(row);
  });
}

function Descending(indexNo) {
  const tableBody = document.querySelector(".dataTable tbody");

  const rows = document.querySelectorAll(".trial");

  const sortedRows = Array.from(rows).sort((a, b) => {
    const aValue = a.cells[indexNo].textContent.trim();
    const bValue = b.cells[indexNo].textContent.trim();
    // console.log(bValue.localeCompare(aValue));
    // return bValue.localeCompare(aValue);
    return bValue - aValue;
  });

  // tableBody.innerHTML = "";

  sortedRows.forEach((row) => {
    tableBody.appendChild(row);
  });
}

// let click;

// tableID.addEventListener("click", function () {
//   console.log("id");
//   this.click = true;

//   if (click) {
//     sortingMethod("ascending", 0);
//     upArrow.classList.add("hidden");
//     downArrow.classList.remove("hidden");
//   } else {
//     sortingMethod("", 0);
//     downArrow.classList.add("hidden");
//     upArrow.classList.remove("hidden");
//   }

//   click = !click;
// });

// tablePrice.addEventListener("click", function () {
//   console.log("price");
//   this.click = true;

//   if (click) {
//     console.log("down");
//     sortingMethod("ascending", 3);
//     upArrow.classList.add("hidden");
//     console.log("hide");
//     downArrow.classList.remove("hidden");
//   } else {
//     console.log("up");
//     sortingMethod("", 3);
//     console.log("hide2");
//     downArrow.classList.add("hidden");
//     console.log(downArr);
//     upArrow.classList.remove("hidden");
//   }

//   click = !click;
// });

// ////////////////////////////////
// ////////////conditional buttons
// function upDownAdd() {
//   [...upArr, ...downArr].forEach((el) => {
//     el.classList.add("hidden");
//     el.classList.add("hidden");
//   });
// }
// function upDownRemove() {
//   [...upArr, ...downArr].forEach((el) => {
//     el.classList.remove("hidden");
//     el.classList.remove("hidden");
//   });
// }

//////////////////////////
//////////////////////////
//////////////////////////
//////////////////////////

let sortColumnIndex = 0; // Default column index for sorting
let ascendingOrder = true; // Default sorting order

// Function to handle sorting
function handleSorting(columnIndex) {
  // Toggle sorting order
  ascendingOrder = columnIndex === sortColumnIndex ? !ascendingOrder : true;
  sortColumnIndex = columnIndex;

  // Remove arrow indicators from other columns
  const arrowIcons = document.querySelectorAll(".arrow-icon");
  arrowIcons.forEach((icon) => (icon.textContent = ""));

  // Set arrow indicator for the current column
  const currentHeader = document.querySelector(
    `th[data-column-index='${columnIndex}']`
  );
  console.log(currentHeader);
  const arrowIcon = currentHeader.querySelector(".arrow-icon");
  arrowIcon.textContent = ascendingOrder ? "↑" : "↓";

  // Sort rows
  if (ascendingOrder) {
    Ascending(columnIndex);
  } else {
    Descending(columnIndex);
  }
}
handleSorting(0);

// Event listeners for table headers
console.log(document.querySelectorAll(".dataTable th"));
document.querySelectorAll(".dataTable th").forEach((header, index) => {
  console.log(header);
  console.log(index);
  // header.addEventListener("click", () => {
  //   handleSorting(index);
  // });
});

////////////////////////
////////////////////////
////////////////////////
///btn show method
function btnShow() {
  const data = JSON.parse(localStorage.getItem("data")) || [];
  const index = data.map((item) => item).length;

  if (index === 0) {
    clearLocal.classList.add("hidden");
    sortDiv.classList.add("hidden");
    // upDownAdd();
  }
  if (index > 0) {
    clearLocal.classList.remove("hidden");
    sortDiv.classList.add("hidden");
    // upDownAdd();
  }
  if (index > 1) {
    clearLocal.classList.remove("hidden");
    sortDiv.classList.remove("hidden");

    // upDownRemove();
  }
}
btnShow();
