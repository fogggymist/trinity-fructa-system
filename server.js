const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const materialsRoute = require('./routes/materials');
const productionRoute = require('./routes/production');
const accountsRoute = require('./routes/accounts');
const reportsRoute = require('./routes/reports');
const suppliersRoute = require('./routes/suppliers');
const finishedGoodsRoute = require('./routes/finishedgoods');
const purchaseOrdersRoute = require('./routes/purchaseorders');

app.use('/api/materials', materialsRoute);
app.use('/api/production', productionRoute);
app.use('/api/accounts', accountsRoute);
app.use('/api/reports', reportsRoute);
app.use('/api/suppliers', suppliersRoute);
app.use('/api/finishedgoods', finishedGoodsRoute);
app.use('/api/purchaseorders', purchaseOrdersRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});