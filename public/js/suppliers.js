document.addEventListener('DOMContentLoaded', function() {
    loadSuppliers();
});

function loadSuppliers() {
    fetch('http://localhost:3000/api/suppliers')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var tableBody = document.getElementById('suppliersTable');
        tableBody.innerHTML = '';

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">No suppliers found</td></tr>';
            return;
        }

        data.forEach(function(item) {
            var row = '<tr>' +
                '<td>' + item.supplier_id + '</td>' +
                '<td>' + item.name + '</td>' +
                '<td>' + item.contact + '</td>' +
                '<td>' + (item.address || 'N/A') + '</td>' +
                '<td><button onclick="deleteSupplier(' + item.supplier_id + ')">Delete</button></td>' +
                '</tr>';
            tableBody.innerHTML += row;
        });
    })
    .catch(function(error) {
        console.log('error loading suppliers:', error);
    });
}

function addSupplier() {
    var name = document.getElementById('supName').value;
    var contact = document.getElementById('supContact').value;
    var address = document.getElementById('supAddress').value;

    if (!name || !contact) {
        showMessage('Please fill in name and contact', 'error');
        return;
    }

    fetch('http://localhost:3000/api/suppliers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            contact: contact,
            address: address
        })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        showMessage('Supplier added successfully!', 'success');
        document.getElementById('supName').value = '';
        document.getElementById('supContact').value = '';
        document.getElementById('supAddress').value = '';
        loadSuppliers();
    })
    .catch(function(error) {
        showMessage('Error adding supplier', 'error');
    });
}

function deleteSupplier(id) {
    if (!confirm('Are you sure you want to delete this supplier?')) return;

    fetch('http://localhost:3000/api/suppliers/' + id, {
        method: 'DELETE'
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        showMessage('Supplier deleted', 'success');
        loadSuppliers();
    })
    .catch(function(error) {
        showMessage('Error deleting supplier', 'error');
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