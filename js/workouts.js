// Workout Schedule JavaScript
class WorkoutManager {
    constructor() {
        this.workouts = JSON.parse(localStorage.getItem('gymWorkouts')) || [];
        this.trainers = JSON.parse(localStorage.getItem('gymTrainers')) || [];
        this.currentWeek = new Date();
        
        this.init();
    }

    init() {
        this.loadWorkoutOverview();
        this.loadWeeklySchedule();
        this.loadTrainers();
        this.loadWorkoutTypes();
        this.bindEvents();
    }

    loadWorkoutOverview() {
        const weeklyWorkouts = this.getWeeklyWorkouts();
        const completedWorkouts = this.getCompletedWorkouts();
        const upcomingWorkouts = this.getUpcomingWorkouts();
        const workoutStreak = this.getWorkoutStreak();

        document.getElementById('weeklyWorkouts').textContent = weeklyWorkouts;
        document.getElementById('completedWorkouts').textContent = completedWorkouts;
        document.getElementById('upcomingWorkouts').textContent = upcomingWorkouts;
        document.getElementById('workoutStreak').textContent = workoutStreak;
    }

    getWeeklyWorkouts() {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        return this.workouts.filter(workout => {
            const workoutDate = new Date(workout.date);
            return workoutDate >= weekStart && workoutDate <= weekEnd;
        }).length;
    }

    getCompletedWorkouts() {
        return this.workouts.filter(workout => workout.completed).length;
    }

    getUpcomingWorkouts() {
        const today = new Date();
        return this.workouts.filter(workout => new Date(workout.date) >= today).length;
    }

    getWorkoutStreak() {
        // Simple streak calculation - consecutive days with workouts
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            
            const hasWorkout = this.workouts.some(workout => 
                new Date(workout.date).toDateString() === checkDate.toDateString()
            );
            
            if (hasWorkout) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    loadWeeklySchedule() {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        days.forEach((day, index) => {
            const container = document.getElementById(`${day}Workouts`);
            container.innerHTML = '';
            
            const dayWorkouts = this.workouts.filter(workout => workout.day === dayNames[index]);
            
            dayWorkouts.forEach(workout => {
                const workoutDiv = document.createElement('div');
                workoutDiv.className = 'workout-item';
                workoutDiv.innerHTML = `
                    <h4>${workout.name}</h4>
                    <p>${workout.time} - ${workout.duration} min</p>
                    <p>Trainer: ${workout.trainer}</p>
                `;
                container.appendChild(workoutDiv);
            });
        });
    }

    loadTrainers() {
        const select = document.getElementById('workoutTrainer');
        select.innerHTML = '<option value="">Select Trainer</option>';
        
        this.trainers.forEach(trainer => {
            const option = document.createElement('option');
            option.value = trainer.name;
            option.textContent = trainer.name;
            select.appendChild(option);
        });

        // Load trainer schedule
        const tbody = document.getElementById('trainerScheduleBody');
        tbody.innerHTML = '';
        
        this.trainers.forEach(trainer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${trainer.name}</td>
                <td>${trainer.specialty}</td>
                <td>${trainer.schedule}</td>
                <td>${trainer.contact}</td>
                <td>4.5/5</td>
                <td>
                    <button class="btn-neon btn-neon-green" onclick="workouts.bookTrainer('${trainer.name}')">
                        Book Session
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    loadWorkoutTypes() {
        // Workout types are already displayed in HTML
    }

    addWorkout() {
        const form = document.getElementById('workoutForm');
        const workout = {
            name: document.getElementById('workoutName').value,
            type: document.getElementById('workoutType').value,
            day: document.getElementById('workoutDay').value,
            time: document.getElementById('workoutTime').value,
            duration: document.getElementById('workoutDuration').value,
            trainer: document.getElementById('workoutTrainer').value,
            date: new Date().toISOString().split('T')[0],
            completed: false
        };

        this.workouts.push(workout);
        localStorage.setItem('gymWorkouts', JSON.stringify(this.workouts));
        
        this.loadWeeklySchedule();
        this.loadWorkoutOverview();
        form.reset();
    }

    bookTrainer(trainerName) {
        alert(`Booking session with ${trainerName}`);
    }

    bindEvents() {
        document.getElementById('workoutForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addWorkout();
        });

        document.getElementById('trainerFilter').addEventListener('change', () => {
            this.filterTrainers();
        });

        document.getElementById('trainerSearch').addEventListener('input', () => {
            this.filterTrainers();
        });
    }

    filterTrainers() {
        const specialty = document.getElementById('trainerFilter').value;
        const searchTerm = document.getElementById('trainerSearch').value.toLowerCase();
        
        let filtered = this.trainers;
        
        if (specialty !== 'all') {
            filtered = filtered.filter(trainer => trainer.specialty === specialty);
        }
        
        if (searchTerm) {
            filtered = filtered.filter(trainer => 
                trainer.name.toLowerCase().includes(searchTerm) ||
                trainer.specialty.toLowerCase().includes(searchTerm)
            );
        }
        
        this.displayFilteredTrainers(filtered);
    }

    displayFilteredTrainers(trainers) {
        const tbody = document.getElementById('trainerScheduleBody');
        tbody.innerHTML = '';
        
        trainers.forEach(trainer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${trainer.name}</td>
                <td>${trainer.specialty}</td>
                <td>${trainer.schedule}</td>
                <td>${trainer.contact}</td>
                <td>4.5/5</td>
                <td>
                    <button class="btn-neon btn-neon-green" onclick="workouts.bookTrainer('${trainer.name}')">
                        Book Session
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    previousWeek() {
        this.currentWeek.setDate(this.currentWeek.getDate() - 7);
        this.updateWeekDisplay();
    }

    nextWeek() {
        this.currentWeek.setDate(this.currentWeek.getDate() + 7);
        this.updateWeekDisplay();
    }

    updateWeekDisplay() {
        const startOfWeek = new Date(this.currentWeek);
        startOfWeek.setDate(this.currentWeek.getDate() - this.currentWeek.getDay());
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const display = document.getElementById('currentWeek');
        display.textContent = `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
    }
}

// Initialize workout manager
const workouts = new WorkoutManager();

// Sample data initialization
if (workouts.trainers.length === 0) {
    workouts.trainers = [
        { name: "Mike Johnson", specialty: "Strength Training", schedule: "Mon-Fri 9AM-6PM", contact: "mike@fitzone.com" },
        { name: "Sarah Wilson", specialty: "HIIT & Cardio", schedule: "Mon-Sat 6AM-7PM", contact: "sarah@fitzone.com" },
        { name: "Emma Davis", specialty: "Yoga & Flexibility", schedule: "Tue-Sun 7AM-5PM", contact: "emma@fitzone.com" }
    ];
    localStorage.setItem('gymTrainers', JSON.stringify(workouts.trainers));
}

// Sample workouts
if (workouts.workouts.length === 0) {
    workouts.workouts = [
        { name: "Morning Yoga", type: "Yoga", day: "Monday", time: "07:00", duration: 60, trainer: "Emma Davis", completed: false },
        { name: "HIIT Session", type: "HIIT", day: "Monday", time: "18:00", duration: 45, trainer: "Sarah Wilson", completed: false },
        { name: "Strength Training", type: "Strength", day: "Tuesday", time: "09:00", duration: 60, trainer: "Mike Johnson", completed: false }
    ];
    localStorage.setItem('gymWorkouts', JSON.stringify(workouts.workouts));
}
