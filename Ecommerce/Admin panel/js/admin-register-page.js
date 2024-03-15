document.addEventListener("DOMContentLoaded", async function () {
    const registrationForm = document.getElementById("registrationForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    registrationForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        let hasValidationErrors = false;

        if (!nameInput.value.trim()) {
            document.getElementById("nameError").innerHTML = "Please enter your name";
            hasValidationErrors = true;
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            document.getElementById("emailError").innerHTML = "Please enter a valid email address.";
            hasValidationErrors = true;
        }

        if (!passwordInput.value.trim()) {
            document.getElementById("passwordError").innerHTML = "Please enter a password";
            hasValidationErrors = true;
        }

        if (!confirmPasswordInput.value.trim()) {
            document.getElementById("confirmPasswordError").innerHTML = "Please enter a confirm password";
            hasValidationErrors = true;
        }

        if (passwordInput.value.trim() !== confirmPasswordInput.value.trim()) {
            document.getElementById("confirmPasswordError").innerHTML = "Passwords do not match";
            hasValidationErrors = true;
        }

        if (hasValidationErrors) {
            return;
        }

       
        

        // Check if there's already an admin
        try {
            const response = await fetch('http://localhost:3000/Admin?role=admin');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const admins = await response.json();

            if (admins.length > 0) {
                // Alert popup if an admin already exists
                openModal("An admin already exists. Only one admin is allowed.");
                return;
            }

            const userData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value.trim(),
                role: "admin", // Set the default role to "admin"
            };

            const postResponse = await fetch('http://localhost:3000/Admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!postResponse.ok) {
                throw new Error('Network response was not ok');
            }

            // Reset the form after successful data storage
            registrationForm.reset();

            window.location.href = "/Admin panel/html/product.html";
        } catch (error) {
            console.error('Error:', error.message);
        }
    });

    nameInput.addEventListener('input', () => {
        document.getElementById("nameError").innerHTML = "";
    });

    emailInput.addEventListener('input', () => {
        document.getElementById("emailError").innerHTML = "";
    });

    passwordInput.addEventListener('input', () => {
        document.getElementById("passwordError").innerHTML = "";
    });

    confirmPasswordInput.addEventListener('input', () => {
        document.getElementById("confirmPasswordError").innerHTML = "";
    });

    const cancelButton = document.getElementById("cancelButton");

    cancelButton.addEventListener("click", function () {
        document.getElementById("nameError").innerHTML = "";
        document.getElementById("emailError").innerHTML = "";
        document.getElementById("passwordError").innerHTML = "";
        document.getElementById("confirmPasswordError").innerHTML = "";
    });
});

function openModal(message) {
    const modal = document.getElementById('messageModal');
    const modalMessage = document.getElementById('modalMessage');
    
    modalMessage.textContent = message;
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('messageModal');
    modal.style.display = 'none';
}