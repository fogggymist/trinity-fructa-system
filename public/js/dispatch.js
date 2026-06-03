document.addEventListener('DOMContentLoaded', () => {
  loadProductionRequests();
  loadFinishedGoods();
});

window.approveRequest = approveRequest;
window.openDispatchForm = openDispatchForm;
window.hideDispatchForm = hideDispatchForm;
window.submitDispatch = submitDispatch;

function loadProductionRequests() {
  fetch('/api/production')
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById('pendingTable');
      table.innerHTML = '';

      data.forEach(req => {
        const status = req.status || 'Pending';
        const statusLower = status.toLowerCase();
        const statusColor = statusLower === 'approved' ? 'green' : 'orange';

        const actionBtn = statusLower === 'pending'
          ? `<button type="button" onclick="approveRequest(${req.request_id})">Approve</button>`
          : `<span style="color:green; font-weight:bold">Approved</span>`;

        table.innerHTML += `
          <tr>
            <td>${req.request_id}</td>
            <td>${req.material_name || req.mat_id}</td>
            <td>${req.quantity_requested}</td>
            <td>${req.date ? req.date.split('T')[0] : 'N/A'}</td>
            <td style="color:${statusColor}; font-weight:bold">${status}</td>
            <td>${actionBtn}</td>
          </tr>
        `;
      });
    })
    .catch(err => console.error('Production load error:', err));
}

function approveRequest(id) {
  fetch(`/api/production/${id}/approve`, {
    method: 'PUT'
  })
    .then(res => res.json())
    .then(() => {
      loadProductionRequests();
    })
    .catch(err => console.error('Approve error:', err));
}

function loadFinishedGoods() {
  fetch('/api/finishedgoods')
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById('dispatchedTable');
      table.innerHTML = '';

      data.forEach(item => {
        const status = item.status || 'in stock';
        const statusLower = status.toLowerCase();

        const actionBtn = Number(item.quantity) <= 0 || statusLower === 'dispatched'
          ? `<span style="color:green; font-weight:bold">Dispatched</span>`
          : `<button type="button" onclick="openDispatchForm(${item.product_id}, ${item.quantity})">Dispatch</button>`;

        table.innerHTML += `
          <tr>
            <td>${item.product_id}</td>
            <td>${item.product_name}</td>
            <td>${item.batch_number || 'N/A'}</td>
            <td>${item.quantity}</td>
            <td>${item.unit}</td>
            <td>${item.manufacturing_date ? item.manufacturing_date.split('T')[0] : 'N/A'}</td>
            <td>${item.expiry_date ? item.expiry_date.split('T')[0] : 'N/A'}</td>
            <td style="color:${statusLower === 'dispatched' ? 'green' : 'blue'}">${status}</td>
            <td>${actionBtn}</td>
          </tr>
        `;
      });
    })
    .catch(err => console.error('Finished goods load error:', err));
}

function openDispatchForm(productId, availableQty) {
  document.getElementById('dispatchProductId').value = productId;
  document.getElementById('availableQuantity').value = availableQty;
  document.getElementById('dispatchQuantity').value = '';
  document.getElementById('maxQuantityText').innerText = `Max available: ${availableQty}`;

  document.getElementById('dispatchFormContainer').style.display = 'block';

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function hideDispatchForm() {
  document.getElementById('dispatchFormContainer').style.display = 'none';

  document.getElementById('dispatchProductId').value = '';
  document.getElementById('availableQuantity').value = '';
  document.getElementById('dispatchQuantity').value = '';
  document.getElementById('maxQuantityText').innerText = '';

  document.getElementById('truckNumber').value = '';
  document.getElementById('driverName').value = '';
  document.getElementById('loadoutCondition').value = '';
  document.getElementById('dispatchNotes').value = '';
}

function submitDispatch() {
  const productId = document.getElementById('dispatchProductId').value;
  const dispatchQty = Number(document.getElementById('dispatchQuantity').value);
  const availableQty = Number(document.getElementById('availableQuantity').value);

  const truck = document.getElementById('truckNumber').value.trim();
  const driver = document.getElementById('driverName').value.trim();
  const condition = document.getElementById('loadoutCondition').value;
  const notes = document.getElementById('dispatchNotes').value.trim();

  if (!dispatchQty || dispatchQty <= 0) {
    alert('Please enter a valid dispatch quantity.');
    return;
  }

  if (dispatchQty > availableQty) {
    alert(`Dispatch quantity cannot be more than available quantity (${availableQty}).`);
    return;
  }

  if (!truck || !driver || !condition) {
    alert('Please fill Truck Number, Driver Name and Loadout Condition.');
    return;
  }

  fetch(`/api/finishedgoods/${productId}/dispatch`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dispatch_quantity: dispatchQty,
      truck_number: truck,
      driver_name: driver,
      loadout_condition: condition,
      dispatch_notes: notes
    })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Dispatch failed');
      }
      return res.json();
    })
    .then(data => {
      alert(data.message || 'Product dispatched successfully');
      hideDispatchForm();
      loadFinishedGoods();
    })
    .catch(err => {
      console.error('Dispatch error:', err);
      alert('Dispatch failed. Check backend route or server console.');
    });
}