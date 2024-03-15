document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logout-btn");
  const cartTableBody = document.querySelector("#cartTable tbody");
  const dialogDetails = document.getElementById("dialogDetails");
  const cartItemDialog = document.getElementById("cartItemDialog");

  // Fetch user data
  fetch("http://localhost:3000/Admin")
    .then((response) => response.json())
    .then((data) => {
      const userName = data[0].name || "";
      const userInitial = document.getElementById("user-initial");
      if (userName.length > 0) {
        userInitial.querySelector("span").textContent = userName
          .charAt(0)
          .toUpperCase();
      }
    })
    .catch((error) => console.error("Error fetching user data:", error));

  // Fetch cart list data
  fetch("http://localhost:3000/cartList")
    .then((response) => response.json())
    .then((cartList) => {
      // Populate the table with cartList data
      cartList.forEach((cartItem) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${cartItem.id}</td>
                    <td>${cartItem.name}</td>
                    <td>${cartItem.quantity}</td>
                    <td>${cartItem.price}</td>
                    <td><button class="action-btn">View</button></td>
                `;
        cartTableBody.appendChild(row);
      });

      // Event listener for "View" button
      cartTableBody.addEventListener("click", function (event) {
        const target = event.target;
        if (target.classList.contains("action-btn")) {
          const rowIndex = target.closest("tr").rowIndex - 1;
          const cartItem = cartList[rowIndex];
          displayCartItemDetails(cartItem);
        }
      });
    })
    .catch((error) => console.error("Error fetching cartList data:", error));

  // Event listener for close button in the dialog
  window.closeDialog = function () {
    cartItemDialog.style.display = "none";
  };

  // Function to display cart item details in the dialog
  function displayCartItemDetails(cartItem) {
    // Clear existing content
    dialogDetails.innerHTML = "";

    // Populate dialog with cartItem data
    const itemDetails = document.createElement("div");
    itemDetails.innerHTML = `
            <img src="${cartItem.image}" alt="${cartItem.name}">
            <p>Name: ${cartItem.name}</p>
            <p>Quantity: ${cartItem.quantity}</p>
            <p>Subtotal: ${cartItem.subtotal}</p>
        `;
    dialogDetails.appendChild(itemDetails);

    // Show the dialog
    cartItemDialog.style.display = "block";
  }

  // Event listener for logout button
  logoutBtn.addEventListener("click", function () {
    window.location.href = "/Admin panel/html/admin-login-page.html";
  });
});
