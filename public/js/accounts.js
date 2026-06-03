document.addEventListener('DOMContentLoaded', function() {
    loadRecords();
    loadMaterials();
});

function loadRecords() {
    fetch('http://localhost:3000/api/accounts')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var tableBody = document.getElementById('accountsTable');
        tableBody.innerHTML = '';

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">No records found</td></tr>';
            return;
        }

        data.forEach(function(item) {
            var row = '<tr>' +
                '<td>' + item.account_id + '</td>' +
                '<td>' + item.mat_id + '</td>' +
                '<td>' + item.invoice_no + '</td>' +
                '<td>₹' + item.price + '</td>' +
                '<td><button onclick="deleteRecord(' + item.account_id + ')">Delete</button></td>' +
                '</tr>';
            tableBody.innerHTML += row;
        });
    })
    .catch(function(error) {
        console.log('error loading records:', error);
    });
}

function loadMaterials() {
    fetch('http://localhost:3000/api/materials')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var select = document.getElementById('accMaterial');
        data.forEach(function(item) {
            var option = document.createElement('option');
            option.value = item.mat_id;
            option.textContent = item.name;
            select.appendChild(option);
        });
    })
    .catch(function(error) {
        console.log('error loading materials:', error);
    });
}

function addRecord() {
    var mat_id = document.getElementById('accMaterial').value;
    var invoice_no = document.getElementById('accInvoice').value;
    var price = document.getElementById('accPrice').value;

    if (!mat_id || !invoice_no || !price) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    fetch('http://localhost:3000/api/accounts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            mat_id: mat_id,
            invoice_no: invoice_no,
            price: price
        })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        showMessage('Record added successfully!', 'success');
        document.getElementById('accMaterial').value = '';
        document.getElementById('accInvoice').value = '';
        document.getElementById('accPrice').value = '';
        loadRecords();
    })
    .catch(function(error) {
        showMessage('Error adding record', 'error');
    });
}

function deleteRecord(id) {
    if (!confirm('Are you sure you want to delete this record?')) return;

    fetch('http://localhost:3000/api/accounts/' + id, {
        method: 'DELETE'
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        showMessage('Record deleted', 'success');
        loadRecords();
    })
    .catch(function(error) {
        showMessage('Error deleting record', 'error');
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