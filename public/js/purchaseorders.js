document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
    loadSuppliers();
    loadMaterials();
});

function toggleMaterialType(type) {
    var existingGroup = document.getElementById('existingMaterialGroup');
    var newGroup = document.getElementById('newMaterialGroup');

    if (type === 'existing') {
        existingGroup.style.display = 'block';
        newGroup.style.display = 'none';
    } else {
        existingGroup.style.display = 'none';
        newGroup.style.display = 'block';
    }
}

function loadOrders() {
    fetch('http://localhost:3000/api/purchaseorders')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var tableBody = document.getElementById('ordersTable');
        tableBody.innerHTML = '';

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="12">No purchase orders found</td></tr>';
            return;
        }

        data.forEach(function(item) {
            var statusColor = '';
            if (item.status === 'ordered') statusColor = 'color:#f39c12; font-weight:600';
            if (item.status === 'received') statusColor = 'color:#2c7a4b; font-weight:600';
            if (item.status === 'cancelled') statusColor = 'color:#e74c3c; font-weight:600';

            var actionBtns = '';
            if (item.status === 'ordered') {
                actionBtns = '<button class="btn-blue" onclick="receiveOrder(' + item.order_id + ')" style="margin-right:5px">Mark Received</button>' +
                             '<button class="btn-danger" onclick="cancelOrder(' + item.order_id + ')">Cancel</button>';
            } else {
                actionBtns = '<span style="color:#aaa; font-size:13px">No actions</span>';
            }

            var row = '<tr>' +
                '<td>' + item.order_id + '</td>' +
                '<td>' + (item.supplier_name || 'N/A') + '</td>' +
                '<td>' + (item.material_name || item.new_material_name || 'N/A') + '</td>' +
                '<td>' + item.quantity_ordered + '</td>' +
                '<td>' + item.unit + '</td>' +
                '<td>' + (item.batch_number || 'N/A') + '</td>' +
                '<td>' + (item.expiry_date ? item.expiry_date.split('T')[0] : 'N/A') + '</td>' +
                '<td>' + (item.expected_delivery ? item.expected_delivery.split('T')[0] : 'N/A') + '</td>' +
                '<td>' + (item.actual_delivery ? item.actual_delivery.split('T')[0] : 'Pending') + '</td>' +
                '<td>' + (item.notes || '-') + '</td>' +
                '<td style="' + statusColor + '">' + item.status + '</td>' +
                '<td>' + actionBtns + '</td>' +
                '</tr>';
            tableBody.innerHTML += row;
        });
    })
    .catch(function(error) {
        console.log('error loading orders:', error);
    });
}

function loadSuppliers() {
    fetch('http://localhost:3000/api/suppliers')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var select = document.getElementById('poSupplier');
        data.forEach(function(item) {
            var option = document.createElement('option');
            option.value = item.supplier_id;
            option.textContent = item.name;
            select.appendChild(option);
        });
    })
    .catch(function(error) {
        console.log('error loading suppliers:', error);
    });
}

function loadMaterials() {
    fetch('http://localhost:3000/api/materials')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var select = document.getElementById('poMaterial');
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

function placeOrder() {
    var matType = document.querySelector('input[name="matType"]:checked').value;
    var supplier_id = document.getElementById('poSupplier').value;
    var quantity_ordered = document.getElementById('poQty').value;
    var unit = document.getElementById('poUnit').value;
    var expected_delivery = document.getElementById('poDelivery').value;
    var notes = document.getElementById('poNotes').value;
    var batch_number = document.getElementById('poBatch').value;
    var manufacturing_date = document.getElementById('poMfgDate').value;
    var expiry_date = document.getElementById('poExpiry').value;

    var mat_id = null;
    var new_material_name = null;

    if (matType === 'existing') {
        mat_id = document.getElementById('poMaterial').value;
        if (!mat_id) {
            showMessage('Please select a material', 'error');
            return;
        }
    } else {
        new_material_name = document.getElementById('poNewMatName').value;
        if (!new_material_name) {
            showMessage('Please enter a material name', 'error');
            return;
        }
    }

    if (!supplier_id || !quantity_ordered || !unit || !expected_delivery) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }

    fetch('http://localhost:3000/api/purchaseorders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            supplier_id: supplier_id,
            mat_id: mat_id || null,
            new_material_name: new_material_name || null,
            quantity_ordered: quantity_ordered,
            unit: unit,
            expected_delivery: expected_delivery,
            notes: notes || null,
            batch_number: batch_number || null,
            manufacturing_date: manufacturing_date || null,
            expiry_date: expiry_date || null
        })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        showMessage('Purchase order placed successfully!', 'success');
        document.getElementById('poSupplier').value = '';
        document.getElementById('poMaterial').value = '';
        document.getElementById('poQty').value = '';
        document.getElementById('poUnit').value = '';
        document.getElementById('poDelivery').value = '';
        document.getElementById('poNotes').value = '';
        document.getElementById('poNewMatName').value = '';
        document.getElementById('poBatch').value = '';
        document.getElementById('poMfgDate').value = '';
        document.getElementById('poExpiry').value = '';
        loadOrders();
    })
    .catch(function(error) {
        showMessage('Error placing order', 'error');
    });
}

function receiveOrder(id) {
    if (!confirm('Confirm delivery received? This will automatically update the stock.')) return;

    fetch('http://localhost:3000/api/purchaseorders/' + id + '/receive', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        showMessage('Order received and stock updated!', 'success');
        loadOrders();
    })
    .catch(function(error) {
        showMessage('Error updating order', 'error');
    });
}

function cancelOrder(id) {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    fetch('http://localhost:3000/api/purchaseorders/' + id + '/cancel', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        showMessage('Order cancelled', 'success');
        loadOrders();
    })
    .catch(function(error) {
        showMessage('Error cancelling order', 'error');
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