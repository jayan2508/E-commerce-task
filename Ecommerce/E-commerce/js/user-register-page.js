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
            const userData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value.trim(),
                role: "user", // Set the default role to "user"
            };

            const postResponse = await fetch('http://localhost:3000/users', {
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

            // Redirect to users page
            // window.location.href = "/Admin panel/html/users.html";
            window.location.href = `/E-commerce/html/e-commerce.html?name=${encodeURIComponent(userData.name)}&email=${(userData.email)}`;
        } catch (error) {
            console.error('Error:', error.message);
            // Handle error, display a message, or redirect as needed
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
