<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Gym Management Dashboard</title>
<style>
    body {
        font-family: 'Segoe UI', sans-serif;
        margin: 0;
        background: linear-gradient(to right, #0f2027, #203a43, #2c5364);
        color: white;
    }

    header {
        text-align: center;
        padding: 20px;
        background: rgba(0,0,0,0.4);
        font-size: 1.8rem;
        letter-spacing: 1px;
    }

    .container {
        max-width: 1100px;
        margin: auto;
        padding: 20px;
    }

    .table-container {
        background: rgba(255,255,255,0.05);
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 0 15px rgba(0,0,0,0.5);
        margin-bottom: 30px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    th {
        background: rgba(255,255,255,0.1);
    }

    tr:hover {
        background: rgba(255,255,255,0.08);
    }

    .type-badge {
        background: #ff9800;
        padding: 5px 10px;
        border-radius: 8px;
        color: black;
        font-weight: bold;
    }

    .rating-badge {
        background: #4caf50;
        padding: 5px 10px;
        border-radius: 8px;
        font-weight: bold;
    }

    .action-btn {
        padding: 5px 10px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        transition: 0.2s;
    }

    .edit-btn {
        background: #2196f3;
        color: white;
    }

    .edit-btn:hover {
        background: #1976d2;
    }

    .delete-btn {
        background: #f44336;
        color: white;
    }

    .delete-btn:hover {
        background: #d32f2f;
    }

    .view-btn {
        background: #9c27b0;
        color: white;
    }

    .view-btn:hover {
        background: #7b1fa2;
    }

    .filters {
        margin-bottom: 15px;
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }

    select, input {
        padding: 6px;
        border-radius: 6px;
        border: none;
        outline: none;
    }

    .contact-link {
        color: #4fc3f7;
        text-decoration: none;
    }
</style>
</head>
<body>

<header>🏋️ Gym Management Dashboard</header>

<div class="container">
    <!-- Workout Table -->
    <div class="table-container">
        <h2>Workouts</h2>
        <div class="filters">
            <select id="workoutDayFilter">
                <option value="all">All Days</option>
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
            </select>
            <select id="workoutTypeFilter">
                <option value="all">All Types</option>
                <option value="strength">Strength</option>
                <option value="hiit">HIIT</option>
                <option value="flexibility">Flexibility</option>
                <option value="core">Core</option>
                <option value="cardio">Cardio</option>
                <option value="recovery">Recovery</option>
            </select>
            <input type="text" id="workoutSearch" placeholder="Search workout...">
        </div>
        <table>
            <thead>
                <tr>
                    <th>Day</th>
                    <th>Time</th>
                    <th>Workout</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Trainer</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="workoutTableBody"></tbody>
        </table>
    </div>

    <!-- Trainer Table -->
    <div class="table-container">
        <h2>Trainers</h2>
        <div class="filters">
            <select id="trainerSpecialtyFilter">
                <option value="all">All Specialties</option>
                <option value="strength training">Strength Training</option>
                <option value="hiit & cardio">HIIT & Cardio</option>
                <option value="yoga & flexibility">Yoga & Flexibility</option>
                <option value="spin & cardio">Spin & Cardio</option>
                <option value="core & pilates">Core & Pilates</option>
            </select>
            <input type="text" id="trainerSearch" placeholder="Search trainer...">
        </div>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Specialty</th>
                    <th>Experience</th>
                    <th>Contact</th>
                    <th>Schedule</th>
                    <th>Rating</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody id="trainerTableBody"></tbody>
        </table>
    </div>
</div>

<script>
// ==== Your JS Data and Functions Here ====
const workoutData = [
    { day: "Monday", time: "09:00 AM", workout: "Upper Body Strength", type: "Strength", duration: "60 min", trainer: "Mike Johnson" },
    { day: "Monday", time: "05:30 PM", workout: "HIIT Cardio", type: "HIIT", duration: "45 min", trainer: "Sarah Wilson" },
    { day: "Tuesday", time: "07:00 AM", workout: "Yoga Flow", type: "Flexibility", duration: "50 min", trainer: "Emma Davis" },
    { day: "Wednesday", time: "06:00 PM", workout: "Lower Body Strength", type: "Strength", duration: "60 min", trainer: "Mike Johnson" },
    { day: "Thursday", time: "12:00 PM", workout: "Core & Abs", type: "Core", duration: "30 min", trainer: "Lisa Chen" },
    { day: "Friday", time: "04:30 PM", workout: "Spin Class", type: "Cardio", duration: "45 min", trainer: "David Kim" },
    { day: "Saturday", time: "10:00 AM", workout: "Full Body Circuit", type: "HIIT", duration: "60 min", trainer: "Sarah Wilson" },
    { day: "Sunday", time: "Rest Day", workout: "Active Recovery", type: "Recovery", duration: "30 min", trainer: "Emma Davis" }
];

const trainerData = [
    { name: "Mike Johnson", specialty: "Strength Training", experience: "5 years", contact: "mike@fitzone.com", schedule: "Mon-Fri 9AM-6PM", rating: "4.8/5" },
    { name: "Sarah Wilson", specialty: "HIIT & Cardio", experience: "3 years", contact: "sarah@fitzone.com", schedule: "Mon-Sat 6AM-7PM", rating: "4.9/5" },
    { name: "Emma Davis", specialty: "Yoga & Flexibility", experience: "4 years", contact: "emma@fitzone.com", schedule: "Tue-Sun 7AM-5PM", rating: "4.7/5" },
    { name: "David Kim", specialty: "Spin & Cardio", experience: "6 years", contact: "david@fitzone.com", schedule: "Mon-Fri 12PM-8PM", rating: "4.6/5" },
    { name: "Lisa Chen", specialty: "Core & Pilates", experience: "3 years", contact: "lisa@fitzone.com", schedule: "Wed-Sun 8AM-4PM", rating: "4.8/5" }
];

// Render Workout Table
function renderWorkoutTable() {
    const tbody = document.getElementById('workoutTableBody');
    tbody.innerHTML = '';
    
    workoutData.forEach((workout, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${workout.day}</td>
            <td>${workout.time}</td>
            <td>${workout.workout}</td>
            <td><span class="type-badge">${workout.type}</span></td>
            <td>${workout.duration}</td>
            <td>${workout.trainer}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editWorkout(${index})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteWorkout(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render Trainer Table
function renderTrainerTable() {
    const tbody = document.getElementById('trainerTableBody');
    tbody.innerHTML = '';
    
    trainerData.forEach((trainer) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${trainer.name}</td>
            <td>${trainer.specialty}</td>
            <td>${trainer.experience}</td>
            <td><a href="mailto:${trainer.contact}" class="contact-link">${trainer.contact}</a></td>
            <td>${trainer.schedule}</td>
            <td><span class="rating-badge">${trainer.rating}</span></td>
            <td><button class="action-btn view-btn" onclick="viewTrainer('${trainer.name}')">View</button></td>
        `;
        tbody.appendChild(row);
    });
}

// Filter Workouts
function filterWorkouts() {
    const dayFilter = document.getElementById('workoutDayFilter').value;
    const typeFilter = document.getElementById('workoutTypeFilter').value;
    const searchTerm = document.getElementById('workoutSearch').value.toLowerCase();
    
    const rows = document.getElementById('workoutTableBody').querySelectorAll('tr');
    
    rows.forEach(row => {
        const day = row.cells[0].textContent.toLowerCase();
        const type = row.cells[3].textContent.toLowerCase();
        const workout = row.cells[2].textContent.toLowerCase();
        
        const dayMatch = dayFilter === 'all' || day === dayFilter;
        const typeMatch = typeFilter === 'all' || type === typeFilter;
        const searchMatch = searchTerm === '' || workout.includes(searchTerm) || day.includes(searchTerm);
        
        row.style.display = dayMatch && typeMatch && searchMatch ? '' : 'none';
    });
}

// Filter Trainers
function filterTrainers() {
    const specialtyFilter = document.getElementById('trainerSpecialtyFilter').value;
    const searchTerm = document.getElementById('trainerSearch').value.toLowerCase();
    
    const rows = document.getElementById('trainerTableBody').querySelectorAll('tr');
    
    rows.forEach(row => {
        const specialty = row.cells[1].textContent.toLowerCase();
        const name = row.cells[0].textContent.toLowerCase();
        
        const specialtyMatch = specialtyFilter === 'all' || specialty === specialtyFilter;
        const searchMatch = searchTerm === '' || name.includes(searchTerm) || specialty.includes(searchTerm);
        
        row.style.display = specialtyMatch && searchMatch ? '' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderWorkoutTable();
    renderTrainerTable();
    
    document.getElementById('workoutDayFilter').addEventListener('change', filterWorkouts);
    document.getElementById('workoutTypeFilter').addEventListener('change', filterWorkouts);
    document.getElementById('workoutSearch').addEventListener('input', filterWorkouts);
    
    document.getElementById('trainerSpecialtyFilter').addEventListener('change', filterTrainers);
    document.getElementById('trainerSearch').addEventListener('input', filterTrainers);
});

function editWorkout(index) {
    alert(`Edit workout: ${workoutData[index].workout}`);
}

function deleteWorkout(index) {
    workoutData.splice(index, 1);
    renderWorkoutTable();
}

function viewTrainer(name) {
    alert(`View trainer details for: ${name}`);
}
</script>

</body>
</html>
