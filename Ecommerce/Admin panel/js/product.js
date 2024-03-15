document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logout-btn");
  const openModalBtn = document.getElementById("openModalBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const productModal = document.getElementById("productModal");

  // Fetch data from the JSON server
  fetch("http://localhost:3000/Admin")
    .then((response) => response.json())
    .then((data) => {
      // Assuming the data contains a 'name' property
      const userName = data[0].name || "";

      // Display the first letter of the name in the span tag
      const userInitial = document.getElementById("user-initial");
      if (userName.length > 0) {
        userInitial.querySelector("span").textContent = userName
          .charAt(0)
          .toUpperCase();
      }
    })
    .catch((error) => console.error("Error fetching data:", error));

  logoutBtn.addEventListener("click", function () {
    window.location.href = "/Admin panel/html/admin-login-page.html";
  });

  openModalBtn.addEventListener("click", function () {
    editingProductId = null;
    productModal.style.display = "flex";
  });

  // Function to reset modal data
  function resetModalData() {
    const productNameInput = document.getElementById("productName");
    const productDescriptionInput =
      document.getElementById("productDescription");
    const productQuantityInput = document.getElementById("productQuantity");
    const productPriceInput = document.getElementById("productPrice");
    const productColorsContainer = document.getElementById(
      "productColorsContainer"
    );
    const productSizesInputs = document.querySelectorAll("#productSizes input");
    const productImagesContainer = document.getElementById("selectedImages");

    // Reset form fields to their initial state
    productNameInput.value = "";
    productDescriptionInput.value = "";
    productQuantityInput.value = "";
    productPriceInput.value = "";
    productColorsContainer.innerHTML = "";
    productImagesContainer.innerHTML = "";

    productSizesInputs.forEach((sizeInput) => {
      sizeInput.checked = false;
    });
  }

  // Add event listener to close modal button
  closeModalBtn.addEventListener("click", function () {
    productModal.style.display = "none";
    // Reset modal data when modal is closed
    resetModalData();
    clearValidationMessages();
  });

  fetch("http://localhost:3000/products")
    .then((response) => response.json())
    .then((products) => {
      const productTableBody = document.getElementById("productTableBody");

      // Clear existing table rows
      productTableBody.innerHTML = "";

      // Populate the table with product information
      products.forEach((product) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>${product.price}</td>
                <td>${product.sizes.join(", ")}</td>
                <td>
                    <button onclick="editProduct('${product.id}')">Edit</button>
                    <button onclick="deleteProduct('${
                      product.id
                    }')">Delete</button>
                </td>
            `;
        productTableBody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching product data:", error));
});

let editingProductId = null;

// Function to handle the edit product
function editProduct(productId) {
  editingProductId = productId;

  // Fetch the specific product data by productId
  fetch(`http://localhost:3000/products/${productId}`)
    .then((response) => response.json())
    .then((product) => {
      // Fill the modal with the retrieved data
      const productNameInput = document.getElementById("productName");
      const productDescriptionInput =
        document.getElementById("productDescription");
      const productQuantityInput = document.getElementById("productQuantity");
      const productPriceInput = document.getElementById("productPrice");
      const productColorsContainer = document.getElementById(
        "productColorsContainer"
      );
      const productSizesInputs = document.querySelectorAll(
        "#productSizes input"
      );
      const productImagesContainer = document.getElementById("selectedImages");

      // Set the values in the modal form
      productNameInput.value = product.name;
      productDescriptionInput.value = product.description;
      productQuantityInput.value = product.quantity;
      productPriceInput.value = product.price;

      // Display existing colors in the modal
      productColorsContainer.innerHTML = "";
      product.colors.forEach((color) => {
        addColorInput(color);
      });

      // Check the sizes in the modal form based on the product data
      productSizesInputs.forEach((sizeInput) => {
        sizeInput.checked = product.sizes.includes(sizeInput.value);
      });

      // Display existing images in the modal
      productImagesContainer.innerHTML = "";
      product.images.forEach((imagePath) => {
        const imgContainer = document.createElement("div");
        const img = document.createElement("img");
        const closeIcon = document.createElement("span");

        img.src = imagePath;
        closeIcon.innerHTML = "&times;";

        // Add close icon click event
        closeIcon.addEventListener("click", function () {
          imgContainer.remove();
        });

        imgContainer.classList.add("close-icon");
        imgContainer.appendChild(closeIcon);
        imgContainer.appendChild(img);
        productImagesContainer.appendChild(imgContainer);
      });

      // Open the modal for editing
      productModal.style.display = "flex";
    })
    .catch((error) =>
      console.error("Error fetching product data for edit:", error)
    );
}
// Function to handle the update product
function updateProduct(productId) {
  trimInputs();
  if (validateInputs()) {
    // Get product data
    const productName = document.getElementById("productName").value.trim();
    const productDescription = document
      .getElementById("productDescription")
      .value.trim();
    const productQuantity = document
      .getElementById("productQuantity")
      .value.trim();
    const productPrice = document.getElementById("productPrice").value.trim();
    const colorInputs = document.querySelectorAll(
      "#productColorsContainer input"
    );
    const productColors = Array.from(colorInputs).map((input) =>
      input.value.trim()
    );
    const productSizes = Array.from(
      document.querySelectorAll("#productSizes input:checked")
    ).map((checkbox) => checkbox.value);

    // Handle image paths
    const productImagesContainer = document.getElementById("selectedImages");
    const imagePaths = Array.from(
      productImagesContainer.querySelectorAll("img")
    ).map((img) => img.src);

    // Create an updated product object
    const updatedProduct = {
      name: productName,
      description: productDescription,
      quantity: productQuantity,
      price: productPrice,
      colors: productColors,
      sizes: productSizes,
      images: imagePaths,
    };

    // Send a PUT request to update the product
    fetch(`http://localhost:3000/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    })
      .then((response) => response.json())
      .then(() => {
        // Close the modal or perform additional actions
        productModal.style.display = "none";
        // Refresh the product table after the update
        fetchProducts();
      })
      .catch((error) => console.error("Error updating product:", error));
  }
}

// Function to handle the delete product
function deleteProduct(productId) {
  // Display the confirmation modal
  const confirmationModal = document.getElementById("confirmationModal");
  confirmationModal.style.display = "flex";

  // Add event listener to confirm delete button
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  confirmDeleteBtn.addEventListener("click", function () {
    // If the user confirms, proceed with deletion
    confirmDelete(productId);
  });

  // Add event listener to cancel delete button
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
  cancelDeleteBtn.addEventListener("click", function () {
    // Close the confirmation modal
    confirmationModal.style.display = "none";
  });
}

// Function to confirm and proceed with deletion
function confirmDelete(productId) {
  // Send a DELETE request to delete the product with the specified ID
  fetch(`http://localhost:3000/products/${productId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then(() => {
      // Close the confirmation modal
      const confirmationModal = document.getElementById("confirmationModal");
      confirmationModal.style.display = "none";

      // Refresh the table after deletion
      fetchProducts();
    })
    .catch((error) => console.error("Error deleting product:", error));
}

// Function to fetch and update the product table
function fetchProducts() {
  fetch("http://localhost:3000/products")
    .then((response) => response.json())
    .then((products) => {
      const productTableBody = document.getElementById("productTableBody");

      // Clear existing table rows
      productTableBody.innerHTML = "";

      // Populate the table with product information
      products.forEach((product) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.quantity}</td>
                    <td>${product.price}</td>
                    <td>${product.sizes.join(", ")}</td>
                    <td>
                        <button onclick="editProduct('${
                          product.id
                        }')">Edit</button>
                        <button onclick="deleteProduct('${
                          product.id
                        }')">Delete</button>
                    </td>
                `;
        productTableBody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching product data:", error));
}

fetchProducts();

// Function to trim input values
function trimInputs() {
  const inputs = document.querySelectorAll(
    "#productForm input, #productForm textarea"
  );
  inputs.forEach((input) => {
    if (input.type !== "file") {
      input.value = input.value.trim();
    }
  });
}

function clearValidationMessages() {
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((message) => {
    message.textContent = "";
  });
}

// Function to validate inputs
function validateInputs() {
  let isValid = true;

  // Clear previous error messages
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((message) => {
    message.textContent = "";
  });

  const productImage = document.getElementById("productImage");
  const productImageError = document.getElementById("productImageError");

  if (!document.getElementById("selectedImages").children.length) {
    productImageError.textContent = "Select at least one image";
    isValid = false;
  } else {
    productImageError.textContent = "";
  }

  productImage.addEventListener("input", () => {
    productImageError.textContent = "";
  });

  // Validate product name
  const productName = document.getElementById("productName");
  const productNameError = document.getElementById("productNameError");
  if (!productName.value.trim()) {
    productNameError.textContent = "Product name is required";
    isValid = false;
  }
  productName.addEventListener("input", () => {
    productNameError.textContent = "";
  });

  // Validate product description
  const productDescription = document.getElementById("productDescription");
  const productDescriptionError = document.getElementById(
    "productDescriptionError"
  );
  if (!productDescription.value.trim()) {
    productDescriptionError.textContent = "Product description is required";
    isValid = false;
  }
  productDescription.addEventListener("input", () => {
    productDescriptionError.textContent = "";
  });

  // Validate product quantity
  const productQuantity = document.getElementById("productQuantity");
  const productQuantityError = document.getElementById("productQuantityError");
  if (!productQuantity.value.trim()) {
    productQuantityError.textContent = "Product quantity is required";
    isValid = false;
  }
  productQuantity.addEventListener("input", () => {
    productQuantityError.textContent = "";
  });

  // Validate product price
  const productPrice = document.getElementById("productPrice");
  const productPriceError = document.getElementById("productPriceError");
  if (!productPrice.value.trim()) {
    productPriceError.textContent = "Product price is required";
    isValid = false;
  }
  productPrice.addEventListener("input", () => {
    productPriceError.textContent = "";
  });

  // Validate product color
  const productColorError = document.getElementById("productColorError");
  if (productColorsContainer.querySelectorAll("input").length < 1) {
    productColorError.textContent = "At least one product color is required";
    isValid = false;
  } else if (productColorsContainer.innerHTML !== "") {
    productColorError.textContent = "";
  }

  // Validate at least one size selected
  const productSizes = document.querySelectorAll("#productSizes input:checked");
  const productSizesError = document.getElementById("productSizesError");
  if (productSizes.length === 0) {
    productSizesError.textContent = "Select at least one size";
    isValid = false;
  }

  const sizeCheckboxes = document.querySelectorAll("#productSizes input");
  sizeCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("input", () => {
      productSizesError.textContent = "";
    });
  });

  return isValid;
}

document.addEventListener("DOMContentLoaded", function () {
  // Function to handle drag and drop
  const dropZone = document.getElementById("dropZone");
  dropZone.addEventListener("dragover", function (e) {
    e.preventDefault();
    dropZone.classList.add("drag-over");
  });

  dropZone.addEventListener("dragleave", function () {
    dropZone.classList.remove("drag-over");
  });

  dropZone.addEventListener("drop", function (e) {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    const files = e.dataTransfer.files;
    handleFiles(files);
  });

  // Function to handle file input change
  document
    .getElementById("productImage")
    .addEventListener("change", handleImageChange);

  const plusButton = document.querySelector(".color-control.plus");
  plusButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    openColorPalette();
  });

  // Add event listener for minus button
  const minusButton = document.querySelector(".color-control.minus");
  minusButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default form submission behavior
  });
});

// Function to handle selected files
function handleFiles(files) {
  const selectedImagesContainer = document.getElementById("selectedImages");
  for (const file of files) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imgContainer = document.createElement("div");
      const img = document.createElement("img");
      const closeIcon = document.createElement("span");

      img.src = e.target.result;
      closeIcon.innerHTML = "&times;";

      // Add close icon click event
      closeIcon.addEventListener("click", function () {
        imgContainer.remove();
      });

      imgContainer.classList.add("close-icon");
      imgContainer.appendChild(closeIcon);
      imgContainer.appendChild(img);
      selectedImagesContainer.appendChild(imgContainer);
    };
    reader.readAsDataURL(file);
  }
}

// Add this function to handle image container click
function handleImageClick() {
  document.getElementById("productImage").click();
}

// Add this function to handle file input change
function handleImageChange() {
  const fileInput = document.getElementById("productImage");
  const selectedImagesContainer = document.getElementById("selectedImages");

  // Clear existing images
  selectedImagesContainer.innerHTML = "";

  // Display selected images
  for (const file of fileInput.files) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imgContainer = document.createElement("div");
      const img = document.createElement("img");
      const closeIcon = document.createElement("span");

      img.src = e.target.result;
      closeIcon.innerHTML = "&times;";

      // Add close icon click event
      closeIcon.addEventListener("click", function () {
        imgContainer.remove();
      });

      imgContainer.classList.add("close-icon");
      imgContainer.appendChild(closeIcon);
      imgContainer.appendChild(img);
      selectedImagesContainer.appendChild(imgContainer);
    };
    reader.readAsDataURL(file);
  }
}

// Add event listener for file input change
document
  .getElementById("productImage")
  .addEventListener("change", handleImageChange);

// Function to add a new color input
function addColorInput(color) {
  const productColorsContainer = document.getElementById(
    "productColorsContainer"
  );
  const newColorInput = document.createElement("input");
  newColorInput.type = "text";
  newColorInput.value = color;
  newColorInput.style.backgroundColor = color;
  newColorInput.readOnly = true;

  // Append the new input to the color container
  productColorsContainer.appendChild(newColorInput);
}

// Function to remove the last color input (keeping at least one input)
function removeColorInput() {
  const productColorsContainer = document.getElementById(
    "productColorsContainer"
  );
  const colorInputs = productColorsContainer.querySelectorAll("input");

  // Check if there is more than one color input
  if (colorInputs.length >= 1) {
    const lastColorInput = colorInputs[colorInputs.length - 1];
    lastColorInput.remove();
  }
}

// Function to open the color palette
function openColorPalette() {
  const colorPalette = document.getElementById("colorPalette");
  colorPalette.style.display = "flex";
}

// Function to select a color from the palette
function selectColor(color) {
  addColorInput(color);
  closeColorPalette();
  document.getElementById("productColorError").textContent = "";
}

// Function to close the color palette
function closeColorPalette() {
  const colorPalette = document.getElementById("colorPalette");
  colorPalette.style.display = "none";
}

// Modify saveProduct function to handle multiple colors
function saveProduct() {
  trimInputs();
  if (validateInputs()) {
    // Get product data
    const productName = document.getElementById("productName").value.trim();
    const productDescription = document
      .getElementById("productDescription")
      .value.trim();
    const productQuantity = document
      .getElementById("productQuantity")
      .value.trim();
    const productPrice = document.getElementById("productPrice").value.trim();
    const colorInputs = document.querySelectorAll(
      "#productColorsContainer input"
    );
    const productColors = Array.from(colorInputs).map((input) =>
      input.value.trim()
    );
    const productSizes = Array.from(
      document.querySelectorAll("#productSizes input:checked")
    ).map((checkbox) => checkbox.value);

    // Handle image paths
    const productImagesContainer = document.getElementById("selectedImages");
    const imagePaths = Array.from(
      productImagesContainer.querySelectorAll("img")
    ).map((img) => img.src);

    // Create a new product object
    const newProduct = {
      name: productName,
      description: productDescription,
      quantity: productQuantity,
      price: productPrice,
      colors: productColors,
      sizes: productSizes,
      images: imagePaths,
    };

    // Determine whether to create a new product or update an existing one
    const url = editingProductId
      ? `http://localhost:3000/products/${editingProductId}`
      : "http://localhost:3000/products";

    const method = editingProductId ? "PUT" : "POST";

    // Send a POST or PUT request to save the product
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        // Close the modal or perform additional actions
        productModal.style.display = "none";
        fetchProducts();
      })
      .catch((error) => console.error("Error saving product:", error));
  }
}
