require('dotenv').config();
     const express = require('express');
     const bodyParser = require('body-parser');
     const cors = require('cors');
     const productRoutes = require('./routes/products');

     const app = express();
     app.use(bodyParser.json());
     app.use(cors({ origin: '*' })); // Update with S3 URL after front-end deployment

     app.use('/products', productRoutes);

     const port = process.env.PORT || 5000;
     app.listen(port, () => console.log(`Server running on port ${port}`));