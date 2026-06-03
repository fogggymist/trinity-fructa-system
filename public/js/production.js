document.addEventListener('DOMContentLoaded', function() {
    loadRequests();
    loadMaterials();
});

function loadRequests() {
    fetch('http://localhost:3000/api/production')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var tableBody = document.getElementById('productionTable');
        tableBody.innerHTML = '';

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">No requests found</td></tr>';
            return;
        }

        data.forEach(function(item) {
            var statusColor = '';
            if (item.status === 'pending') statusColor = 'color:#f39c12; font-weight:600';
            if (item.status === 'approved') statusColor = 'color:#2c7a4b; font-weight:600';
            if (item.status === 'dispatched') statusColor = 'color:#3498db; font-weight:600';

            var row = '<tr>' +
                '<td>' + item.request_id + '</td>' +
                '<td>' + (item.material_name || item.mat_id) + '</td>' +
                '<td>' + item.quantity_requested + '</td>' +
                '<td>' + (item.date ? item.date.split('T')[0] : 'N/A') + '</td>' +
                '<td><span style="' + statusColor + '">' + item.status + '</span></td>' +
                '</tr>';
            tableBody.innerHTML += row;
        });
    })
    .catch(function(error) {
        console.log('error loading requests:', error);
    });
}

function loadMaterials() {
    fetch('http://localhost:3000/api/materials')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var select = document.getElementById('prodMaterial');
        data.forEach(function(item) {
            var option = document.createElement('option');
            option.value = item.mat_id;
            option.textContent = item.name + ' (available: ' + item.quantity + ' ' + item.unit + ')';
            select.appendChild(option);
        });
    })
    .catch(function(error) {
        console.log('error loading materials:', error);
    });
}

function addRequest() {
    var mat_id = document.getElementById('prodMaterial').value;
    var quantity = document.getElementById('prodQty').value;
    var date = document.getElementById('prodDate').value;

    if (!mat_id || !quantity || !date) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    fetch('http://localhost:3000/api/production', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            mat_id: mat_id,
            quantity_requested: quantity,
            date: date,
            status: 'pending'
        })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        showMessage('Request submitted successfully!', 'success');
        document.getElementById('prodMaterial').value = '';
        document.getElementById('prodQty').value = '';
        document.getElementById('prodDate').value = '';
        loadRequests();
    })
    .catch(function(error) {
        showMessage('Error submitting request', 'error');
    });
}

function showMessage(text, type) {
    var msg = document.getElementById('message');
    msg.className = 'alert alert-' + type;
    msg.textContent = text;
    setTimeout(function() {
        msg.textContent = '';
        msg.className = '';
    }, 3000);
}