document.addEventListener('DOMContentLoaded', () => {
    const salesTableBody = document.getElementById('salesTableBody');
    const entryForm = document.getElementById('entryForm');
    const newEntryButton = document.getElementById('newEntryButton');
    const entryModal = document.getElementById('entryModal');
    const closeModalButton = document.getElementById('closeModal');
    const chartCanvas = document.getElementById('annualSalesChart');

    const loggedInUser = sessionStorage.getItem('loggedInUser');
    let allData = JSON.parse(localStorage.getItem('allSalesData')) || {};
    let currentUserSalesData = allData[loggedInUser] || [];
    let annualChart = null;

    const saveData = () => {
        allData[loggedInUser] = currentUserSalesData;
        localStorage.setItem('allSalesData', JSON.stringify(allData));
    };
    
    const renderAnnualChart = () => {
        const monthlyRevenue = Array(12).fill(0);
        const currentYear = new Date().getFullYear();

        currentUserSalesData.forEach(entry => {
            const saleDate = new Date(entry.saleDate);
            if (saleDate.getFullYear() === currentYear) {
                const month = saleDate.getMonth();
                const revenue = entry.sp * entry.pds;
                monthlyRevenue[month] += revenue;
            }
        });

        if (annualChart) { annualChart.destroy(); }

        annualChart = new Chart(chartCanvas, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: `Total Revenue for ${currentYear}`,
                    data: monthlyRevenue,
                    backgroundColor: 'rgba(74, 144, 226, 0.5)',
                    borderColor: 'rgba(74, 144, 226, 1)',
                    borderWidth: 1,
                    borderRadius: 5,
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true } }
            }
        });
    };

    const renderTable = () => {
        salesTableBody.innerHTML = '';
        if (currentUserSalesData.length === 0) {
            salesTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No sales data yet. Add a new entry!</td></tr>`;
        } else {
            currentUserSalesData.forEach((entry, index) => {
                const row = document.createElement('tr');
                row.setAttribute('data-index', index);
                const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
                row.innerHTML = `<td>${entry.productId}</td><td>${entry.productName}</td><td>${formatter.format(entry.mrp)}</td><td>${formatter.format(entry.sp)}</td><td>${entry.pds}</td><td>${entry.category}</td><td><button class="delete-btn" title="Delete Entry">&times;</button></td>`;
                salesTableBody.appendChild(row);
            });
        }
        renderAnnualChart();
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const newEntry = { saleDate: document.getElementById('saleDate').value, productId: document.getElementById('productId').value, productName: document.getElementById('productName').value, mrp: parseFloat(document.getElementById('mrp').value), sp: parseFloat(document.getElementById('sp').value), pds: parseInt(document.getElementById('pds').value, 10), category: document.getElementById('category').value };
        currentUserSalesData.push(newEntry);
        saveData();
        renderTable();
        closeModal();
    };
    
    const deleteEntry = (index) => {
        currentUserSalesData.splice(index, 1);
        saveData();
        renderTable();
    };

    const openModal = () => { document.getElementById('saleDate').valueAsDate = new Date(); entryModal.classList.add('show'); };
    const closeModal = () => { entryForm.reset(); entryModal.classList.remove('show'); };
    
    newEntryButton.addEventListener('click', openModal);
    closeModalButton.addEventListener('click', closeModal);
    entryForm.addEventListener('submit', handleFormSubmit);
    
    salesTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.closest('tr').getAttribute('data-index');
            if (confirm('Are you sure you want to delete this entry?')) { deleteEntry(index); }
        }
    });

    renderTable();
});