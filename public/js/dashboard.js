document.addEventListener('DOMContentLoaded', function() {
    loadStockData();
    loadLowStock();
    loadPendingRequests();
    loadFinishedGoods();
});


function loadStockData() {
    fetch('http://localhost:3000/api/materials')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        document.getElementById('totalMaterials').textContent = data.length;

        var tableBody = document.getElementById('stockTable');
        tableBody.innerHTML = '';

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3">No materials found</td></tr>';
            return;
        }

        data.forEach(function(item) {
            var row = '<tr>' +
                '<td>' + item.name + '</td>' +
                '<td>' + item.unit + '</td>' +
                '<td>' + item.quantity + '</td>' +
                '</tr>';
            tableBody.innerHTML += row;
        });
    })
    .catch(function(error) {
        console.log('error loading materials:', error);
    });
}


function loadLowStock() {
    fetch('http://localhost:3000/api/reports/lowstock')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        document.getElementById('lowStock').textContent = data.length;
    })
    .catch(function(error) {
        console.log('error loading low stock:', error);
    });
}

function loadPendingRequests() {
    fetch('http://localhost:3000/api/production')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var pending = data.filter(function(item) {
            return item.status === 'pending';
        });
        document.getElementById('pendingRequests').textContent = pending.length;
    })
    .catch(function(error) {
        console.log('error loading requests:', error);
    });
}

function loadFinishedGoods() {
    fetch('http://localhost:3000/api/finishedgoods')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        document.getElementById('totalFinished').textContent = data.length;
    })
    .catch(function(error) {
        console.log('error loading finished goods:', error);
    });
}