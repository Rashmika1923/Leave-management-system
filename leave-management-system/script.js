let users = [
    { username: "rashmika", password: "rashmika123", role: "student", name: "RASHMIKA", registerNumber: "S001" },
    { username: "shakthi", password: "shakthi123", role: "student", name: "SHAKTHI", registerNumber: "S002" },
    { username: "guru", password: "guru123", role: "student", name: "GURU", registerNumber: "S003" },
    { username: "admin", password: "admin123", role: "admin" }
];

// Load users & leaves from localStorage or initialize
let leaves = JSON.parse(localStorage.getItem('leaves')) || [];

// Login Logic
document.getElementById('loginForm')?.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = user.role === 'student' ? 'student.html' : 'admin.html';
    } else {
        document.getElementById('errorMessage').innerText = 'Invalid credentials. Please try again.';
    }
});

// Student Dashboard Logic
if (document.getElementById('studentDetails')) {
    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('studentDetails').innerText = `Name: ${user.name}, Register Number: ${user.registerNumber}`;

    document.getElementById('leaveForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const leaveRequest = {
            id: Date.now(), // Unique ID for leave request
            type: document.getElementById('leaveType').value,
            from: document.getElementById('fromDate').value,
            to: document.getElementById('toDate').value,
            reason: document.getElementById('leaveReason').value,
            status: 'Pending',
            studentName: user.name,
            registerNumber: user.registerNumber
        };
        leaves.push(leaveRequest);
        localStorage.setItem('leaves', JSON.stringify(leaves)); // Save to localStorage
        alert('Leave applied successfully!');
        displayLeaveStatus();
        document.getElementById('leaveForm').reset();
    });

    document.getElementById('logout').addEventListener('click', function () {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });

    displayLeaveStatus();
}

// Admin Dashboard Logic
if (document.getElementById('leaveRequests')) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'admin') {
        displayLeaveRequests();
    }

    document.getElementById('logout').addEventListener('click', function () {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
}

// Function to display leave requests for admin (All students)
function displayLeaveRequests() {
    const leaveRequestsDiv = document.getElementById('leaveRequests');
    let storedLeaves = JSON.parse(localStorage.getItem('leaves')) || [];

    leaveRequestsDiv.innerHTML = storedLeaves.length === 0 ? `<p>No leave requests found.</p>` : '';

    storedLeaves.forEach((leave) => {
        leaveRequestsDiv.innerHTML += `
            <div>
                <p>
                    <strong>Student:</strong> ${leave.studentName} (${leave.registerNumber})<br>
                    <strong>Type:</strong> ${leave.type}<br>
                    <strong>From:</strong> ${leave.from}<br>
                    <strong>To:</strong> ${leave.to}<br>
                    <strong>Reason:</strong> ${leave.reason}<br>
                    <strong>Status:</strong> <span id="status-${leave.id}">${leave.status}</span>
                </p>
                ${leave.status === "Pending" ? `
                    <button onclick="approveLeave(${leave.id})">Approve</button>
                    <button onclick="rejectLeave(${leave.id})">Reject</button>
                ` : ""}
                <hr>
            </div>
        `;
    });
}

// Approve Leave Function
function approveLeave(leaveId) {
    let storedLeaves = JSON.parse(localStorage.getItem('leaves')) || [];
    storedLeaves = storedLeaves.map(leave => leave.id === leaveId ? { ...leave, status: 'Approved' } : leave);
    localStorage.setItem('leaves', JSON.stringify(storedLeaves)); // Save changes
    displayLeaveRequests();
}

// Reject Leave Function
function rejectLeave(leaveId) {
    let storedLeaves = JSON.parse(localStorage.getItem('leaves')) || [];
    storedLeaves = storedLeaves.map(leave => leave.id === leaveId ? { ...leave, status: 'Rejected' } : leave);
    localStorage.setItem('leaves', JSON.stringify(storedLeaves)); // Save changes
    displayLeaveRequests();
}

// Function to display leave status for students (WITH CANCEL BUTTON)
function displayLeaveStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    const leaveStatusDiv = document.getElementById('leaveStatus');
    let storedLeaves = JSON.parse(localStorage.getItem('leaves')) || [];

    const userLeaves = storedLeaves.filter(leave => leave.registerNumber === user.registerNumber);
    leaveStatusDiv.innerHTML = userLeaves.length === 0 ? `<p>No leave requests found.</p>` : '';

    userLeaves.forEach(leave => {
        leaveStatusDiv.innerHTML += `
            <p>
                Type: ${leave.type}, From: ${leave.from}, To: ${leave.to}, Reason: ${leave.reason}, Status: <strong>${leave.status}</strong>
                ${leave.status === "Pending" ? `<button onclick="cancelLeave(${leave.id})">Cancel</button>` : ""}
            </p>
        `;
    });
}

// Function to Cancel Leave (Only if Status is Pending)
function cancelLeave(leaveId) {
    let storedLeaves = JSON.parse(localStorage.getItem('leaves')) || [];
    storedLeaves = storedLeaves.filter(leave => leave.id !== leaveId); // Remove the leave request
    localStorage.setItem('leaves', JSON.stringify(storedLeaves)); // Save updated list
    alert("Leave request canceled successfully!");
    displayLeaveStatus(); // Refresh student leave status
    if (document.getElementById('leaveRequests')) {
        displayLeaveRequests(); // Refresh admin dashboard if open
    }
}
// Function to play sound
function playClickSound() {
    let audio = new Audio('click-sound.mp3'); // Add a click sound file in your project folder
    audio.play();
}

// Attach the function to all buttons
document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", playClickSound);
});
document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");
    const body = document.body;

    // Check local storage for saved theme preference
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
        themeToggle.checked = true;
    }

    // Toggle theme on switch change
    themeToggle.addEventListener("change", function () {
        if (themeToggle.checked) {
            body.classList.add("dark-mode");
            localStorage.setItem("theme", "dark");
        } else {
            body.classList.remove("dark-mode");
            localStorage.setItem("theme", "light");
        }
    });
});



