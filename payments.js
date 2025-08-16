// Payment Management JavaScript
class PaymentManager {
    constructor() {
        this.members = JSON.parse(localStorage.getItem('gymMembers')) || [];
        this.payments = JSON.parse(localStorage.getItem('gymPayments')) || [];
        
        this.init();
    }

    init() {
        this.loadPaymentOverview();
        this.loadMembers();
        this.loadPaymentHistory();
        this.loadRenewals();
        this.bindEvents();
    }

    loadPaymentOverview() {
        const totalRevenue = this.calculateTotalRevenue();
        const pendingPayments = this.calculatePendingPayments();
        const activeMembers = this.calculateActiveMembers();
        const overdueAccounts = this.calculateOverdueAccounts();

        document.getElementById('totalRevenue').textContent = totalRevenue;
        document.getElementById('pendingPayments').textContent = pendingPayments;
        document.getElementById('activeMembers').textContent = activeMembers;
        document.getElementById('overdueAccounts').textContent = overdueAccounts;
    }

    calculateTotalRevenue() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        return this.payments
            .filter(payment => {
                const paymentDate = new Date(payment.date);
                return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
            })
            .reduce((total, payment) => total + payment.amount, 0);
    }

    calculatePendingPayments() {
        const today = new Date();
        return this.payments
            .filter(payment => new Date(payment.nextDue) < today && payment.status === 'Pending')
            .reduce((total, payment) => total + payment.amount, 0);
    }

    calculateActiveMembers() {
        return this.payments.filter(payment => 
            new Date(payment.nextDue) > new Date()
        ).length;
    }

    calculateOverdueAccounts() {
        const today = new Date();
        return this.payments.filter(payment => 
            new Date(payment.nextDue) < today && payment.status === 'Pending'
        ).length;
    }

    loadMembers() {
        const select = document.getElementById('paymentMember');
        select.innerHTML = '<option value="">Select Member</option>';
        
        this.members.forEach(member => {
            const option = document.createElement('option');
            option.value = member.email;
            option.textContent = member.name;
            select.appendChild(option);
        });
    }

    loadPaymentHistory() {
        const tbody = document.getElementById('paymentsTableBody');
        tbody.innerHTML = '';
        
        this.payments.forEach((payment, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${payment.memberName}</td>
                <td>$${payment.amount}</td>
                <td>${payment.date}</td>
                <td>${payment.method}</td>
                <td><span class="status-badge status-${payment.status.toLowerCase()}">${payment.status}</span></td>
                <td>${payment.nextDue}</td>
                <td>
                    <button class="btn-neon btn-neon-blue" onclick="payment.viewPayment(${index})">View</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    loadRenewals() {
        const grid = document.getElementById('renewalsGrid');
        grid.innerHTML = '';
        
        const upcomingRenewals = this.payments.filter(payment => {
            const nextDue = new Date(payment.nextDue);
            const today = new Date();
            const daysLeft = Math.ceil((nextDue - today) / (1000 * 60 * 60 * 24));
            return daysLeft <= 30 && daysLeft >= 0;
        });

        upcomingRenewals.forEach(payment => {
            const member = this.members.find(m => m.email === payment.memberEmail);
            const daysLeft = Math.ceil((new Date(payment.nextDue) - new Date()) / (1000 * 60 * 60 * 24));
            
            const card = document.createElement('div');
            card.className = 'renewal-card neon-card';
            
            let urgencyClass = 'safe';
            if (daysLeft <= 7) urgencyClass = 'urgent';
            else if (daysLeft <= 14) urgencyClass = 'warning';
            
            card.innerHTML = `
                <h4>${member.name}</h4>
                <p>Membership: ${payment.membership}</p>
                <p class="days-left ${urgencyClass}">${daysLeft} days left</p>
                <button class="btn-neon btn-neon-green" onclick="payment.renewMembership('${payment.memberEmail}')">
                    Renew Now
                </button>
            `;
            grid.appendChild(card);
        });
    }

    processPayment() {
        const form = document.getElementById('paymentForm');
        const memberEmail = document.getElementById('paymentMember').value;
        const member = this.members.find(m => m.email === memberEmail);
        
        const payment = {
            id: Date.now(),
            memberName: member.name,
            memberEmail: memberEmail,
            amount: parseFloat(document.getElementById('paymentAmount').value),
            membership: document.getElementById('paymentMembership').value,
            method: document.getElementById('paymentMethod').value,
            date: document.getElementById('paymentDate').value,
            nextDue: document.getElementById('nextDueDate').value,
            status: 'Completed'
        };

        this.payments.push(payment);
        localStorage.setItem('gymPayments', JSON.stringify(this.payments));
        
        this.loadPaymentHistory();
        this.loadRenewals();
        this.loadPaymentOverview();
        form.reset();
        
        alert('Payment processed successfully!');
    }

    renewMembership(email) {
        const member = this.members.find(m => m.email === email);
        const lastPayment = this.payments.filter(p => p.memberEmail === email).pop();
        
        if (lastPayment) {
            const nextDue = new Date(lastPayment.nextDue);
            nextDue.setMonth(nextDue.getMonth() + 1);
            
            document.getElementById('paymentMember').value = email;
            document.getElementById('paymentMembership').value = lastPayment.membership;
            document.getElementById('paymentAmount').value = lastPayment.amount;
            document.getElementById('paymentDate').value = new Date().toISOString().split('T')[0];
            document.getElementById('nextDueDate').value = nextDue.toISOString().split('T')[0];
            
            document.getElementById('paymentForm').scrollIntoView({ behavior: 'smooth' });
        }
    }

    viewPayment(index) {
        const payment = this.payments[index];
        alert(`Payment Details:\n\nMember: ${payment.memberName}\nAmount: $${payment.amount}\nDate: ${payment.date}\nMethod: ${payment.method}\nStatus: ${payment.status}\nNext Due: ${payment.nextDue}`);
    }

    filterPayments() {
        const searchTerm = document.getElementById('paymentSearch').value.toLowerCase();
        const statusFilter = document.getElementById('paymentStatusFilter').value;
        const dateRange = document.getElementById('dateRangeFilter').value;
        
        let filtered = this.payments;
        
        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(payment => 
                payment.memberName.toLowerCase().includes(searchTerm)
            );
        }
        
        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(payment => payment.status === statusFilter);
        }
        
        // Filter by date range
        const today = new Date();
        const rangeStart = new Date();
        
        switch(dateRange) {
            case 'today':
                rangeStart.setDate(today.getDate() - 1);
                break;
            case 'week':
                rangeStart.setDate(today.getDate() - 7);
                break;
            case 'month':
                rangeStart.setMonth(today.getMonth() - 1);
                break;
            default:
                rangeStart.setFullYear(2000);
        }
        
        filtered = filtered.filter(payment => 
            new Date(payment.date) >= rangeStart
        );
        
        this.displayFilteredPayments(filtered);
    }

    displayFilteredPayments(payments) {
        const tbody = document.getElementById('paymentsTableBody');
        tbody.innerHTML = '';
        
        payments.forEach((payment, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${payment.memberName}</td>
                <td>$${payment.amount}</td>
                <td>${payment.date}</td>
                <td>${payment.method}</td>
                <td><span class="status-badge status-${payment.status.toLowerCase()}">${payment.status}</span></td>
                <td>${payment.nextDue}</td>
                <td>
                    <button class="btn-neon btn-neon-blue" onclick="payment.viewPayment(${index})">View</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    bindEvents() {
        document.getElementById('paymentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processPayment();
        });

        document.getElementById('paymentSearch').addEventListener('input', () => {
            this.filterPayments();
        });

        document.getElementById('paymentStatusFilter').addEventListener('change', () => {
            this.filterPayments();
        });

        document.getElementById('dateRangeFilter').addEventListener('change', () => {
            this.filterPayments();
        });
    }
}

// Initialize payment manager
const payment = new PaymentManager();

// Sample data initialization
if (payment.payments.length === 0) {
    payment.payments = [
        {
            id: 1,
            memberName: "John Doe",
            memberEmail: "john@example.com",
            amount: 49,
            membership: "Premium",
            method: "Credit Card",
            date: new Date().toISOString().split('T')[0],
            nextDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: "Completed"
        },
        {
            id: 2,
            memberName: "Jane Smith",
            memberEmail: "jane@example.com",
            amount: 29,
            membership: "Basic",
            method: "Cash",
            date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            nextDue: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: "Completed"
        }
    ];
    localStorage.setItem('gymPayments', JSON.stringify(payment.payments));
}

// Set default payment date
document.getElementById('paymentDate').value = new Date().toISOString().split('T')[0];
document.getElementById('nextDueDate').value = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
