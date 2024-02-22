const addBtn = document.querySelector(".cnt");
const closeBtn = document.querySelector(".btn--close-modal");
const overlay = document.querySelector(".overlay");
const addWindow = document.querySelector(".add-window");
const uploadBtn = document.querySelector(".upload__btn");
const clearLocal = document.querySelector(".clear");
const edit = document.querySelector(".edit-btn");

const toggleModal = function () {
  overlay.classList.toggle("hidden");
  addWindow.classList.toggle("hidden");
};
//open modal
addBtn.addEventListener("click", toggleModal);

//close modal
closeBtn.addEventListener("click", toggleModal);

//////////// upload modal description

uploadBtn.addEventListener("click", function (e) {
  e.preventDefault();

  let id = document.getElementById("id").value;
  let pname = document.getElementById("name").value;
  let category = document.getElementById("category").value;
  let price = document.getElementById("price").value;
  let availability = document.getElementById("availability").value;

  if (id && pname && category && price && availability != "") {
    const newRow = `
    <tr id='trial'>
    <td>${id}</td>
    <td>${pname}</td>
    <td>${category}</td>
    <td>${price}</td>
    <td>${availability}</td>
    <td><button class='edit-btn' data-id='${id}'>Edit</button></td>
    </tr>
    `;

    document
      .querySelector(".dataTable tbody")
      .insertAdjacentHTML("afterend", newRow);

    overlay.classList.toggle("hidden");
    addWindow.classList.toggle("hidden");

    const data = JSON.parse(localStorage.getItem("data")) || [];
    data.push({ id, pname, category, price, availability });
    localStorage.setItem("data", JSON.stringify(data));

    document.getElementById("id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("category").value = "";
    document.getElementById("price").value = "";
    document.getElementById("availability").value = "";
  } else {
    alert("Please fill up all the inputs first");
  }
});

//clearing local storage
clearLocal.addEventListener("click", function () {
  clearLocal.classList.remove("hidden");
  localStorage.clear("data");
  location.reload();
});

///////////////////////////
///////////////////////////
///////////////////////////
//////////////////////////
/// Function to handle edit button click
const handleEdit = function (e) {
  if (e.target.classList.contains("edit-btn")) {
    const id = e.target.dataset.id;
    const row = document.getElementById(id);
    const cells = row.querySelectorAll("td");

    // Populate modal with existing data
    document.getElementById("id").value = cells[0].textContent;
    document.getElementById("name").value = cells[1].textContent;
    document.getElementById("category").value = cells[2].textContent;
    document.getElementById("price").value = cells[3].textContent;
    document.getElementById("availability").value = cells[4].textContent;

    // Show modal for editing
    toggleModal();
  }
};

// Event listener for edit buttons
document
  .querySelector(".dataTable tbody")
  .addEventListener("click", handleEdit);

// Update edited data
uploadBtn.addEventListener("click", function (e) {
  e.preventDefault();

  let id = document.getElementById("id").value;
  let pname = document.getElementById("name").value;
  let category = document.getElementById("category").value;
  let price = document.getElementById("price").value;
  let availability = document.getElementById("availability").value;

  if (id && pname && category && price && availability != "") {
    const newRow = `
    <tr id='${id}'>
    <td>${id}</td>
    <td>${pname}</td>
    <td>${category}</td>
    <td>${price}</td>
    <td>${availability}</td>
    <td><button class='edit-btn' data-id='${id}'>Edit</button></td>
    </tr>
    `;

    // Update existing row with edited data
    document.getElementById(id).outerHTML = newRow;

    const data = JSON.parse(localStorage.getItem("data")) || [];
    const index = data.findIndex((item) => item.id === id);
    if (index !== -1) {
      data[index] = { id, pname, category, price, availability };
    } else {
      data.push({ id, pname, category, price, availability });
    }
    localStorage.setItem("data", JSON.stringify(data));

    overlay.classList.toggle("hidden");
    addWindow.classList.toggle("hidden");

    document.getElementById("id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("category").value = "";
    document.getElementById("price").value = "";
    document.getElementById("availability").value = "";
  } else {
    alert("Please fill up all the inputs first");
  }
});
