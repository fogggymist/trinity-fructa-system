document.addEventListener('DOMContentLoaded', function() {
    loadFinishedGoods();
});

function loadFinishedGoods() {
    fetch('http://localhost:3000/api/finishedgoods')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var tableBody = document.getElementById('finishedGoodsTable');
        tableBody.innerHTML = '';

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="10">No finished goods found</td></tr>';
            return;
        }

        data.forEach(function(item) {
            // calculate shelf life
            var shelfLife = 'N/A';
            if (item.expiry_date) {
                var today = new Date();
                var expiry = new Date(item.expiry_date);
                var daysLeft = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

                if (daysLeft < 0) {
                    shelfLife = '<span style="color:#e74c3c; font-weight:600">Expired</span>';
                } else if (daysLeft <= 30) {
                    shelfLife = '<span style="color:#e74c3c; font-weight:600">' + daysLeft + ' days</span>';
                } else if (daysLeft <= 60) {
                    shelfLife = '<span style="color:#f39c12; font-weight:600">' + daysLeft + ' days</span>';
                } else {
                    shelfLife = '<span style="color:#2c7a4b; font-weight:600">' + daysLeft + ' days</span>';
                }
            }

            var statusColor = item.status === 'in stock' ? 'color:#2c7a4b' : 'color:#3498db';

            var row = '<tr>' +
                '<td>' + item.product_id + '</td>' +
                '<td>' + item.product_name + '</td>' +
                '<td>' + (item.batch_number || 'N/A') + '</td>' +
                '<td>' + item.unit + '</td>' +
                '<td>' + item.quantity + '</td>' +
                '<td>' + (item.manufacturing_date ? item.manufacturing_date.split('T')[0] : 'N/A') + '</td>' +
                '<td>' + (item.expiry_date ? item.expiry_date.split('T')[0] : 'N/A') + '</td>' +
                '<td>' + shelfLife + '</td>' +
                '<td><span style="' + statusColor + '; font-weight:600">' + item.status + '</span></td>' +
                '<td><button class="btn-danger" onclick="deleteProduct(' + item.product_id + ')">Delete</button></td>' +
                '</tr>';
            tableBody.innerHTML += row;
        });
    })
    .catch(function(error) {
        console.log('error loading finished goods:', error);
    });
}

function addProduct() {
    var product_name = document.getElementById('prodName').value;
    var batch_number = document.getElementById('prodBatch').value;
    var unit = document.getElementById('prodUnit').value;
    var quantity = document.getElementById('prodQty').value;
    var manufacturing_date = document.getElementById('prodMfgDate').value;
    var expiry_date = document.getElementById('prodExpiry').value;

    if (!product_name || !unit || !quantity) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }

    fetch('http://localhost:3000/api/finishedgoods', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            product_name: product_name,
            batch_number: batch_number || null,
            manufacturing_date: manufacturing_date || null,
            expiry_date: expiry_date || null,
            quantity: quantity,
            unit: unit
        })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        showMessage('Product added successfully!', 'success');
        document.getElementById('prodName').value = '';
        document.getElementById('prodBatch').value = '';
        document.getElementById('prodUnit').value = '';
        document.getElementById('prodQty').value = '';
        document.getElementById('prodMfgDate').value = '';
        document.getElementById('prodExpiry').value = '';
        loadFinishedGoods();
    })
    .catch(function(error) {
        showMessage('Error adding product', 'error');
    });
}

function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    fetch('http://localhost:3000/api/finishedgoods/' + id, {
        method: 'DELETE'
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        showMessage('Product deleted', 'success');
        loadFinishedGoods();
    })
    .catch(function(error) {
        showMessage('Error deleting product', 'error');
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