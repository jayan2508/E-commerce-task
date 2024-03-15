document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logout-btn");

  // Function to get the query parameter from the URL
  function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Fetch data from the JSON server
  fetch("http://localhost:3000/users")
    .then((response) => response.json())
    .then((data) => {
      const userNameFromUrl = getQueryParam("name") || ""; // Get username from URL

      // Display the first letter of the name in the span tag
      const userInitial = document.getElementById("user-initial");
      if (userNameFromUrl.length > 0) {
        userInitial.querySelector("span").textContent = userNameFromUrl
          .charAt(0)
          .toUpperCase();
      }
    })
    .catch((error) => console.error("Error fetching data:", error));

  logoutBtn.addEventListener("click", function () {
    window.location.href = "/E-commerce/html/user-login.html";
  });
  fetchProductData();
});

function fetchProductData() {
  fetch("http://localhost:3000/products")
    .then((response) => response.json())
    .then((products) => displayProducts(products))
    .catch((error) => console.error("Error fetching products:", error));
}

function displayProducts(products) {
  const productCardsContainer = document.getElementById("productCards");
  productCardsContainer.innerHTML = "";

  products.forEach((product) => {
    const card = createProductCard(product);
    productCardsContainer.appendChild(card);
  });
  // Call searchProducts to display all products initially
  searchProducts();
}

function createProductCard(product) {
  const card = document.createElement("div");
  card.classList.add("card");

  if (product.images && product.images.length > 0) {
    const img = document.createElement("img");
    img.src = product.images[0]; // Assuming the first image in the array is the main image
    img.alt = product.name;
    card.appendChild(img);
  }

  const name = document.createElement("h3");
  name.textContent = product.name;
  card.appendChild(name);

  const price = document.createElement("p");
  price.textContent = `Price: ${product.price}`;
  card.appendChild(price);

  const addToCartBtn = document.createElement("button");
  addToCartBtn.classList.add("add-to-cart-btn");
  addToCartBtn.textContent = "Add to Cart";
  addToCartBtn.addEventListener("click", () => openDialog(product)); // Add your addToCart function
  card.appendChild(addToCartBtn);

  return card;
}

function searchProducts() {
  const searchInput = document.getElementById("searchInput");
  const searchTerm = searchInput.value.toLowerCase();

  const productCards = document.querySelectorAll(".product-cards .card");
  const noMatchMessage = document.getElementById("noMatchMessage");

  let anyMatches = false;

  productCards.forEach((card) => {
    const productName = card.querySelector("h3").textContent.toLowerCase();
    const displayStyle = productName.includes(searchTerm) ? "flex" : "none";
    card.style.display = displayStyle;

    if (productName.includes(searchTerm)) {
      anyMatches = true;
    }
  });

  // Show or hide the no match message based on search results
  noMatchMessage.style.display = anyMatches ? "none" : "flex";
}

function openDialog(product) {
  const dialog = document.getElementById("productDialog");
  const carouselImages = document.querySelector(".carousel-images");
  const carouselThumbnails = document.getElementById("carouselThumbnails");
  const dialogDetails = document.getElementById("dialogDetails");
  const colorForm = document.getElementById("colorForm");
  const dialogPrice = document.getElementById("dialogPrice");
  const sizeSection = document.getElementById("sizeSection");

  // Set content in the dialog
  dialogDetails.innerHTML = `<h3>${product.name}</h3><p>${product.description}</p>`;
  dialogPrice.textContent = `Price: ${product.price}`;

  // Populate the carousel with images from the product's image array

  carouselImages.innerHTML = "";
  carouselThumbnails.innerHTML = "";
  product.images.forEach((imageUrl, index) => {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = product.name;
    img.style.display = index === 0 ? "block" : "none"; // Show the first image, hide others
    const thumbnail = document.createElement("img");
    thumbnail.src = imageUrl;
    thumbnail.alt = product.name;
    thumbnail.addEventListener("click", () => {
      // Switch to the clicked thumbnail image
      switchImage(index);
    });

    // Initially show the first image and its thumbnail
    if (index === 0) {
      img.style.display = "block";
      thumbnail.classList.add("active");
    } else {
      img.style.display = "none";
    }

    carouselImages.appendChild(img);
    carouselThumbnails.appendChild(thumbnail);
  });

  const switchImage = (index) => {
    // Hide all images and remove the 'active' class from all thumbnails
    carouselImages.querySelectorAll("img").forEach((img, i) => {
      img.style.display = i === index ? "block" : "none";
    });
    carouselThumbnails.querySelectorAll("img").forEach((thumb, i) => {
      thumb.classList.toggle("active", i === index);
    });
  };

  // Create radio buttons dynamically based on available colors
  colorForm.innerHTML = "";
  product.colors.forEach((color) => {
    const radioBtn = document.createElement("input");
    radioBtn.type = "radio";
    radioBtn.name = "color";
    radioBtn.value = color.trim();
    colorForm.appendChild(radioBtn);

    const colorLabel = document.createElement("label");
    colorLabel.style.backgroundColor = color.trim();
    colorForm.appendChild(colorLabel);
  });

  // Create radio buttons dynamically based on available sizes
  sizeSection.style.display = "block";
  const sizeOptions = document.getElementById("sizeOptions");
  sizeOptions.innerHTML = "";
  product.sizes.forEach((size) => {
    const sizeRadioBtn = document.createElement("input");
    sizeRadioBtn.type = "radio";
    sizeRadioBtn.name = "size";
    sizeRadioBtn.value = size;
    sizeOptions.appendChild(sizeRadioBtn);

    const sizeLabel = document.createElement("label");
    sizeLabel.textContent = size;
    sizeOptions.appendChild(sizeLabel);
  });

  const quantityElement = document.getElementById("quantity");

  // Set the quantity value to 1 initially
  quantityElement.textContent = "1";

  // Store the available product quantity as a data attribute
  quantityElement.dataset.maxQuantity = product.quantity;

  dialog.style.display = "block";
}

function prevImage() {
  const images = document.querySelectorAll(".carousel-images img");
  const currentImage = Array.from(images).find(
    (img) => img.style.display === "block"
  );
  const prevImage =
    currentImage.previousElementSibling || images[images.length - 1]; // Wrap around if at the first image
  currentImage.style.display = "none";
  prevImage.style.display = "block";

  // Find the active thumbnail and remove the 'active' class
  const thumbnails = document.querySelectorAll("#carouselThumbnails img");
  const activeThumbnail = Array.from(thumbnails).find((thumb) =>
    thumb.classList.contains("active")
  );
  activeThumbnail.classList.remove("active");

  // Find the corresponding thumbnail for the previous image and add the 'active' class
  const prevThumbnail = Array.from(thumbnails).find(
    (thumb) => thumb.src === prevImage.src
  );
  prevThumbnail.classList.add("active");
}

function nextImage() {
  const images = document.querySelectorAll(".carousel-images img");
  const currentImage = Array.from(images).find(
    (img) => img.style.display === "block"
  );
  const nextImage = currentImage.nextElementSibling || images[0]; // Wrap around if at the last image
  currentImage.style.display = "none";
  nextImage.style.display = "block";

  // Find the active thumbnail and remove the 'active' class
  const thumbnails = document.querySelectorAll("#carouselThumbnails img");
  const activeThumbnail = Array.from(thumbnails).find((thumb) =>
    thumb.classList.contains("active")
  );
  activeThumbnail.classList.remove("active");

  // Find the corresponding thumbnail for the next image and add the 'active' class
  const nextThumbnail = Array.from(thumbnails).find(
    (thumb) => thumb.src === nextImage.src
  );
  nextThumbnail.classList.add("active");
}

function closeDialog() {
  const dialog = document.getElementById("productDialog");
  dialog.style.display = "none";
}

function adjustQuantity(change) {
  const quantityElement = document.getElementById("quantity");
  let quantity = parseInt(quantityElement.textContent, 10);
  const maxQuantity = parseInt(quantityElement.dataset.maxQuantity, 10);

  // Increment or decrement the quantity, ensuring it doesn't go below 1 or exceed the maxQuantity
  quantity = Math.min(maxQuantity, Math.max(1, quantity + change));

  // Update the displayed quantity
  quantityElement.textContent = quantity.toString();
}

function addCart() {
  // Validate size and color selection
  const selectedSize = document.querySelector("#sizeOptions input:checked");
  const selectedColor = document.querySelector('input[name="color"]:checked');
  let hasValidationErrors = false;

  if (!selectedSize) {
    document.getElementById("sizeError").textContent = "Size is required";
    hasValidationErrors = true;
  } else {
    document.getElementById("sizeError").textContent = "";
  }

  if (!selectedColor) {
    document.getElementById("colorError").textContent = "Color is required";
    hasValidationErrors = true;
  } else {
    document.getElementById("colorError").textContent = "";
  }

  const sizeOptions = document.querySelectorAll("#sizeOptions input");
  const colorOptions = document.querySelectorAll('input[name="color"]');

  sizeOptions.forEach((sizeInput) => {
    sizeInput.addEventListener("click", () => {
      document.getElementById("sizeError").textContent = "";
    });
  });

  colorOptions.forEach((colorInput) => {
    colorInput.addEventListener("click", () => {
      document.getElementById("colorError").textContent = "";
    });
  });

  if (hasValidationErrors) {
    return;
  }

  // Get email from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const emailFromUrl = urlParams.get("email");

  if (emailFromUrl) {
    // Add email data to the productData
    const productData = {
      name: document.querySelector("#dialogDetails h3").textContent,
      size: selectedSize.value,
      color: selectedColor.value,
      price: parseFloat(
        document.getElementById("dialogPrice").textContent.split(":")[1].trim()
      ),
      quantity: parseInt(document.getElementById("quantity").textContent),
      image: document.querySelector(".carousel-images img").src,
      email: emailFromUrl, // Add email data here
    };

    productData.subtotal = productData.price * productData.quantity;

    // Send a POST request to the server to add the product to the cartList array
    fetch("http://localhost:3000/cartList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add product to cart");
        }
        updateCartItemCount();
        closeDialog();
      })
      .catch((error) => console.error("Error adding product to cart:", error));
  } else {
    // Handle the case where email is not provided in the URL
    console.error("Email is missing in the URL");
  }
}

// Function to update the cart item count
function updateCartItemCount() {
  // Get email from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const emailFromUrl = urlParams.get("email");

  if (emailFromUrl) {
    // Fetch cart items based on the email
    fetch(
      `http://localhost:3000/cartList?email=${encodeURIComponent(emailFromUrl)}`
    )
      .then((response) => response.json())
      .then((cartItems) => {
        const cartItemCountElement = document.getElementById("cartItemCount");
        cartItemCountElement.textContent = cartItems.length.toString();
      })
      .catch((error) => console.error("Error fetching cart items:", error));
  } else {
    console.error("Email is missing in the URL");
  }
}

document.addEventListener("DOMContentLoaded", updateCartItemCount);

const cartDropdown = document.getElementById("cartDropdown");
const confirmationModal = document.getElementById("confirmationModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
let itemToRemove = null;

// Fetch cart list data and display in dropdown
document.addEventListener("DOMContentLoaded", function () {
  const cartDropdown = document.getElementById("cartDropdown");
  const footer = document.createElement("div");
  footer.classList.add("dropdown-footer");

  // Get email from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const emailFromUrl = urlParams.get("email");

  if (emailFromUrl) {
    // Fetch cart list data based on the email
    fetch(
      `http://localhost:3000/cartList?email=${encodeURIComponent(emailFromUrl)}`
    )
      .then((response) => response.json())
      .then((cartItems) => {
        // Clear existing content
        cartDropdown.innerHTML = "";
        footer.innerHTML = "";

        // Check if cart is empty
        if (cartItems.length === 0) {
          cartDropdown.innerHTML = "<p>Cart is empty</p>";
          return;
        }

        // Variables for total quantity and total subtotal
        let totalQuantity = 0;
        let totalSubtotal = 0;

        // Iterate over cart items and display in dropdown
        cartItems.forEach((item) => {
          const cartItem = document.createElement("div");
          cartItem.classList.add("cart-item");

          // Create an image element
          const img = document.createElement("img");
          img.src = item.image;
          img.alt = item.name;

          // Create a div for details
          const detailsDiv = document.createElement("div");
          detailsDiv.classList.add("item-details");

          // Create a paragraph for the name
          const nameParagraph = document.createElement("p");
          nameParagraph.textContent = `${item.name}`;

          // Create a paragraph for the subtotal
          const subtotalParagraph = document.createElement("p");
          subtotalParagraph.textContent = `${item.quantity} × ${item.price} = ${item.subtotal}`;

          // Update total quantity and subtotal
          totalQuantity += item.quantity;
          totalSubtotal += item.subtotal;

          // Append elements to detailsDiv
          detailsDiv.appendChild(nameParagraph);
          detailsDiv.appendChild(subtotalParagraph);

          // Append image and detailsDiv to cartItem
          cartItem.appendChild(img);
          cartItem.appendChild(detailsDiv);

          // Append close icon to cartItem
          const closeIcon = document.createElement("span");
          closeIcon.classList.add("close-icon");
          closeIcon.textContent = "×";
          closeIcon.addEventListener("click", function () {
            // Handle removing the item from the cart (you can implement this logic)
            removeFromCart(item.id);
          });
          cartItem.appendChild(closeIcon);

          // Append cartItem to cartDropdown
          cartDropdown.appendChild(cartItem);
        });

        // Display total quantity and total subtotal in the footer
        footer.innerHTML = `
                    <p>Total Quantity: ${totalQuantity}</p>
                    <p>Total Subtotal: ${totalSubtotal}</p>
                `;

        // Append footer to cartDropdown
        cartDropdown.appendChild(footer);
      })
      .catch((error) => console.error("Error fetching cart items:", error));

    function removeFromCart(itemId) {
      // Show the confirmation modal before removing the item
      itemToRemove = itemId;
      confirmationModal.style.display = "flex";
    }

    confirmDeleteBtn.addEventListener("click", function () {
      // Remove the item from the cart after confirmation
      if (itemToRemove) {
        fetch(`http://localhost:3000/cartList/${itemToRemove}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to remove item from cart");
            }
            // Refresh the cart dropdown after successful removal
            document.dispatchEvent(new Event("DOMContentLoaded"));
            // Hide the confirmation modal
            confirmationModal.style.display = "none";
          })
          .catch((error) =>
            console.error("Error removing item from cart:", error)
          );
      }
    });

    cancelDeleteBtn.addEventListener("click", function () {
      // Cancel the removal and hide the confirmation modal
      itemToRemove = null;
      confirmationModal.style.display = "none";
    });
  } else {
    // Handle the case where email is missing in the URL
    console.error("Email is missing in the URL");
  }
});
