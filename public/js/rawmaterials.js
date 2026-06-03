document.addEventListener('DOMContentLoaded', function() {
    loadPendingOrders();
    loadMaterials();
});

function loadPendingOrders() {
    fetch('http://localhost:3000/api/purchaseorders/pending')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var tableBody = document.getElementById('pendingOrdersTable');
        tableBody.innerHTML = '';

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="9" style="color:#2c7a4b">✅ No pending deliveries</td></tr>';
            return;
        }

        data.forEach(function(item) {
            var row = '<tr>' +
                '<td>' + item.order_id + '</td>' +
                '<td>' + (item.supplier_name || 'N/A') + '</td>' +
                '<td>' + (item.material_name || item.new_material_name || 'N/A') + '</td>' +
                '<td>' + item.quantity_ordered + '</td>' +
                '<td>' + item.unit + '</td>' +
                '<td>' + (item.batch_number || 'N/A') + '</td>' +
                '<td>' + (item.expiry_date ? item.expiry_date.split('T')[0] : 'N/A') + '</td>' +
                '<td>' + (item.expected_delivery ? item.expected_delivery.split('T')[0] : 'N/A') + '</td>' +
                '<td><button class="btn-blue" onclick="confirmReceived(' + item.order_id + ')">Confirm Received</button></td>' +
                '</tr>';
            tableBody.innerHTML += row;
        });
    })
    .catch(function(error) {
        console.log('error loading pending orders:', error);
    });
}

function confirmReceived(id) {
    if (!confirm('Confirm this delivery has been received? Stock will be updated automatically.')) return;

    fetch('http://localhost:3000/api/purchaseorders/' + id + '/receive', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        loadPendingOrders();
        loadMaterials();
    })
    .catch(function(error) {
        console.log('error confirming delivery:', error);
    });
}

function loadMaterials() {
    fetch('http://localhost:3000/api/materials')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var tableBody = document.getElementById('materialsTable');
        tableBody.innerHTML = '';

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7">No materials in stock</td></tr>';
            return;
        }

        data.forEach(function(item) {
            var today = new Date();
            var status = 'N/A';

            if (item.expiry_date) {
                var expiry = new Date(item.expiry_date);
                var daysLeft = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

                if (daysLeft < 0) {
                    status = '<span style="color:#e74c3c; font-weight:600">Expired</span>';
                } else if (daysLeft <= 30) {
                    status = '<span style="color:#e74c3c; font-weight:600">Near Expiry (' + daysLeft + ' days)</span>';
                } else {
                    status = '<span style="color:#2c7a4b; font-weight:600">Good</span>';
                }
            }

            var rowStyle = item.quantity < 10 ? 'background-color:#fff0f0' : '';

            var row = '<tr style="' + rowStyle + '">' +
                '<td>' + item.mat_id + '</td>' +
                '<td>' + item.name + '</td>' +
                '<td>' + item.unit + '</td>' +
                '<td style="' + (item.quantity < 10 ? 'color:#e74c3c; font-weight:600' : '') + '">' + item.quantity + '</td>' +
                '<td>' + (item.batch_number || 'N/A') + '</td>' +
                '<td>' + (item.expiry_date ? item.expiry_date.split('T')[0] : 'N/A') + '</td>' +
                '<td>' + status + '</td>' +
                '</tr>';
            tableBody.innerHTML += row;
        });
    })
    .catch(function(error) {
        console.log('error loading materials:', error);
    });
}