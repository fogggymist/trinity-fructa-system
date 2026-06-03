var stockChartInstance = null;
var productionChartInstance = null;
window.expiryChartInstance = null;

document.addEventListener('DOMContentLoaded', function() {
    showReport('stock');
    loadStockChart();
    loadProductionChart();
    loadExpiryChart();
});

function loadStockChart() {
    fetch('http://localhost:3000/api/reports/stock')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var labels = data.map(function(item) { return item.name; });
        var quantities = data.map(function(item) { return item.quantity; });

        var colors = quantities.map(function(q) {
            return q < 10 ? '#e74c3c' : '#2c7a4b';
        });

        var ctx = document.getElementById('stockChart').getContext('2d');
        if (stockChartInstance) stockChartInstance.destroy();

        stockChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Quantity in Stock',
                    data: quantities,
                    backgroundColor: colors,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    })
    .catch(function(error) {
        console.log('error loading stock chart:', error);
    });
}

function loadProductionChart() {
    fetch('http://localhost:3000/api/production')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var pending = data.filter(function(i) { return i.status === 'pending'; }).length;
        var approved = data.filter(function(i) { return i.status === 'approved'; }).length;
        var dispatched = data.filter(function(i) { return i.status === 'dispatched'; }).length;

        var ctx = document.getElementById('productionChart').getContext('2d');
        if (productionChartInstance) productionChartInstance.destroy();

        productionChartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Pending', 'Approved', 'Dispatched'],
                datasets: [{
                    data: [pending, approved, dispatched],
                    backgroundColor: ['#f39c12', '#2c7a4b', '#3498db']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    })
    .catch(function(error) {
        console.log('error loading production chart:', error);
    });
}

function loadExpiryChart() {
    fetch('http://localhost:3000/api/materials')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var good = 0;
        var nearExpiry = 0;
        var expired = 0;
        var noDate = 0;

        var today = new Date();

        data.forEach(function(item) {
            if (!item.expiry_date) {
                noDate++;
                return;
            }
            var expiry = new Date(item.expiry_date);
            var daysLeft = (expiry - today) / (1000 * 60 * 60 * 24);

            if (daysLeft < 0) {
                expired++;
            } else if (daysLeft <= 30) {
                nearExpiry++;
            } else {
                good++;
            }
        });

        var ctx = document.getElementById('expiryChart').getContext('2d');
        if (window.expiryChartInstance) window.expiryChartInstance.destroy();

        window.expiryChartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Good', 'Near Expiry', 'Expired', 'No Date'],
                datasets: [{
                    data: [good, nearExpiry, expired, noDate],
                    backgroundColor: ['#2c7a4b', '#f39c12', '#e74c3c', '#95a5a6']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    })
    .catch(function(error) {
        console.log('error loading expiry chart:', error);
    });
}

function showReport(type) {
    var title = document.getElementById('reportTitle');
    var container = document.getElementById('reportContainer');

    container.innerHTML = 'Loading...';

    if (type === 'stock') {
        title.textContent = 'Stock Report';
        fetch('http://localhost:3000/api/reports/stock')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.length === 0) {
                container.innerHTML = '<p style="padding:20px">No stock data found</p>';
                return;
            }

            var table = '<table><thead><tr>' +
                '<th>Material</th>' +
                '<th>Unit</th>' +
                '<th>Quantity</th>' +
                '<th>Supplier</th>' +
                '<th>Shelf Life</th>' +
                '</tr></thead><tbody>';

            data.forEach(function(item) {
                var rowStyle = item.quantity < 10 ? 'background-color:#fff0f0' : '';

                var shelfLife = 'N/A';
                if (item.expiry_date) {
                    var today = new Date();
                    var expiry = new Date(item.expiry_date);
                    var daysLeft = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

                    if (daysLeft < 0) {
                        shelfLife = '<span style="color:#e74c3c; font-weight:600">Expired</span>';
                    } else if (daysLeft <= 30) {
                        shelfLife = '<span style="color:#e74c3c; font-weight:600">' + daysLeft + ' days left</span>';
                    } else if (daysLeft <= 60) {
                        shelfLife = '<span style="color:#f39c12; font-weight:600">' + daysLeft + ' days left</span>';
                    } else {
                        shelfLife = '<span style="color:#2c7a4b; font-weight:600">' + daysLeft + ' days left</span>';
                    }
                }

                table += '<tr style="' + rowStyle + '">' +
                    '<td>' + item.name + '</td>' +
                    '<td>' + item.unit + '</td>' +
                    '<td>' + item.quantity + '</td>' +
                    '<td>' + (item.supplier || 'N/A') + '</td>' +
                    '<td>' + shelfLife + '</td>' +
                    '</tr>';
            });

            table += '</tbody></table>';
            container.innerHTML = table;
        })
        .catch(function(error) {
            container.innerHTML = '<p>Error loading report</p>';
        });

    } else if (type === 'lowstock') {
        title.textContent = 'Low Stock Report';
        fetch('http://localhost:3000/api/reports/lowstock')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.length === 0) {
                container.innerHTML = '<p style="padding:20px; color:#2c7a4b">✅ All stock levels are healthy!</p>';
                return;
            }

            var table = '<table><thead><tr>' +
                '<th>Material</th>' +
                '<th>Unit</th>' +
                '<th>Quantity</th>' +
                '</tr></thead><tbody>';

            data.forEach(function(item) {
                table += '<tr style="background-color:#fff0f0">' +
                    '<td>' + item.name + '</td>' +
                    '<td>' + item.unit + '</td>' +
                    '<td style="color:#e74c3c; font-weight:600">' + item.quantity + '</td>' +
                    '</tr>';
            });

            table += '</tbody></table>';
            container.innerHTML = table;
        })
        .catch(function(error) {
            container.innerHTML = '<p>Error loading report</p>';
        });

    } else if (type === 'production') {
        title.textContent = 'Production Report';
        fetch('http://localhost:3000/api/reports/production')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.length === 0) {
                container.innerHTML = '<p style="padding:20px">No production requests found</p>';
                return;
            }

            var table = '<table><thead><tr>' +
                '<th>Request ID</th>' +
                '<th>Material</th>' +
                '<th>Quantity</th>' +
                '<th>Date</th>' +
                '<th>Status</th>' +
                '</tr></thead><tbody>';

            data.forEach(function(item) {
                var statusColor = '';
                if (item.status === 'pending') statusColor = 'color:#f39c12; font-weight:600';
                if (item.status === 'approved') statusColor = 'color:#2c7a4b; font-weight:600';
                if (item.status === 'dispatched') statusColor = 'color:#3498db; font-weight:600';

                table += '<tr>' +
                    '<td>' + item.request_id + '</td>' +
                    '<td>' + item.material + '</td>' +
                    '<td>' + item.quantity_requested + '</td>' +
                    '<td>' + (item.date ? item.date.split('T')[0] : 'N/A') + '</td>' +
                    '<td style="' + statusColor + '">' + item.status + '</td>' +
                    '</tr>';
            });

            table += '</tbody></table>';
            container.innerHTML = table;
        })
        .catch(function(error) {
            container.innerHTML = '<p>Error loading report</p>';
        });

    } else if (type === 'finishedgoods') {
        title.textContent = 'Finished Goods Report';
        fetch('http://localhost:3000/api/finishedgoods')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.length === 0) {
                container.innerHTML = '<p style="padding:20px">No finished goods found</p>';
                return;
            }

            var table = '<table><thead><tr>' +
                '<th>Product Name</th>' +
                '<th>Batch No</th>' +
                '<th>Unit</th>' +
                '<th>Quantity</th>' +
                '<th>Expiry Date</th>' +
                '<th>Shelf Life</th>' +
                '<th>Status</th>' +
                '</tr></thead><tbody>';

            data.forEach(function(item) {
                var shelfLife = 'N/A';
                if (item.expiry_date) {
                    var today = new Date();
                    var expiry = new Date(item.expiry_date);
                    var daysLeft = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

                    if (daysLeft < 0) {
                        shelfLife = '<span style="color:#e74c3c; font-weight:600">Expired</span>';
                    } else if (daysLeft <= 30) {
                        shelfLife = '<span style="color:#e74c3c; font-weight:600">' + daysLeft + ' days left</span>';
                    } else if (daysLeft <= 60) {
                        shelfLife = '<span style="color:#f39c12; font-weight:600">' + daysLeft + ' days left</span>';
                    } else {
                        shelfLife = '<span style="color:#2c7a4b; font-weight:600">' + daysLeft + ' days left</span>';
                    }
                }

                var statusColor = item.status === 'in stock' ? 'color:#2c7a4b; font-weight:600' : 'color:#3498db; font-weight:600';

                table += '<tr>' +
                    '<td>' + item.product_name + '</td>' +
                    '<td>' + (item.batch_number || 'N/A') + '</td>' +
                    '<td>' + item.unit + '</td>' +
                    '<td>' + item.quantity + '</td>' +
                    '<td>' + (item.expiry_date ? item.expiry_date.split('T')[0] : 'N/A') + '</td>' +
                    '<td>' + shelfLife + '</td>' +
                    '<td style="' + statusColor + '">' + item.status + '</td>' +
                    '</tr>';
            });

            table += '</tbody></table>';
            container.innerHTML = table;
        })
        .catch(function(error) {
            container.innerHTML = '<p>Error loading report</p>';
        });
    }
}