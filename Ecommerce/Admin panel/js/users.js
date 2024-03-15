document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById('logout-btn');
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

    let userToDelete = null;

    // Fetch data from the JSON server
    fetch('http://localhost:3000/Admin')
        .then(response => response.json())
        .then(data => {
            // Assuming the data contains a 'name' property
            const userName = data[0].name || '';
            const userInitial = document.getElementById('user-initial');
            if (userName.length > 0) {
                userInitial.querySelector('span').textContent = userName.charAt(0).toUpperCase();
            }
        })
        .catch(error => console.error('Error fetching data:', error));

    logoutBtn.addEventListener('click', function () {
        window.location.href = '/Admin panel/html/admin-login-page.html';
    });

    const usersTable = document.getElementById('usersTable').getElementsByTagName('tbody')[0];

    fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(users => displayUsers(users))
        .catch(error => console.error('Error fetching users:', error));

    function displayUsers(users) {
        users.forEach((user, index) => {
            const row = usersTable.insertRow(-1);
            const numberCell = row.insertCell(0);
            const usernameCell = row.insertCell(1);
            const emailCell = row.insertCell(2);
            const passwordCell = row.insertCell(3);
            const actionCell = row.insertCell(4);

            numberCell.textContent = index + 1; // Display the row number
            usernameCell.textContent = user.name;
            emailCell.textContent = user.email;
            passwordCell.textContent = user.password;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => openConfirmationModal(user, row)); // Open confirmation modal
            actionCell.appendChild(deleteBtn);
        });
    }

    function openConfirmationModal(user, row) {
        userToDelete = { id: user.id, row: row }; // Store the user and its corresponding row
        confirmationModal.style.display = 'flex'; // Show the confirmation modal
    }

    confirmDeleteBtn.addEventListener('click', function () {
        if (userToDelete) {debugger
            deleteUser(userToDelete.id, userToDelete.row);
            confirmationModal.style.display = 'none'; // Hide the modal after confirmation
        }
    });

    cancelDeleteBtn.addEventListener('click', function () {
        confirmationModal.style.display = 'none'; // Hide the modal after confirmation
    });

    function deleteUser(userId, row) {debugger
        // Make a DELETE request to the server to delete the user
        fetch(`http://localhost:3000/users/${userId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            // Remove the row from the table
            usersTable.deleteRow(row.rowIndex);
        })
        .catch(error => console.error('Error deleting user:', error));
    }
});
