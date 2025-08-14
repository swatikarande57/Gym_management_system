// Sample user data for demonstration
const userData = {
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    age: 28,
    gender: "Male",
    membershipType: "Premium Membership",
    membershipStatus: "Active",
    membershipExpiry: "December 31, 2024",
    nextPayment: "$49 - Due Jan 15, 2024",
    classesAttended: 12,
    workoutStreak: 7
};

// Function to load user data into the dashboard
function loadUserData() {
    document.getElementById("userName").innerText = userData.name;
    document.getElementById("userEmail").innerText = userData.email;
    document.getElementById("profileName").innerText = userData.name;
    document.getElementById("profileEmail").innerText = userData.email;
    document.getElementById("profilePhone").innerText = userData.phone;
    document.getElementById("profileAge").innerText = userData.age;
    document.getElementById("profileGender").innerText = userData.gender;
    document.getElementById("membershipType").innerText = userData.membershipType;
    document.getElementById("membershipStatus").innerText = userData.membershipStatus;
    document.getElementById("membershipExpiry").innerText = userData.membershipExpiry;
    document.getElementById("nextPayment").innerText = userData.nextPayment;
    document.getElementById("classesCount").innerText = userData.classesAttended + " Attended";
    document.getElementById("workoutStreak").innerText = userData.workoutStreak + " Days";
}

// Function to handle logout
function logout() {
    alert("You have been logged out.");
    window.location.href = "index.html"; // Redirect to login page
}

// Call loadUserData on page load
window.onload = loadUserData;
