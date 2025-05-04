const express = require('express');
const app = express();
require('dotenv').config();

const productRoutes = require('./routes/products');
app.use(express.json());

app.use('/api/products', productRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
