require('dotenv').config();
     const express = require('express');
     const bodyParser = require('body-parser');
     const cors = require('cors');
     const productRoutes = require('./routes/products');

     const app = express();
     app.use(bodyParser.json());
     const S3_FRONTEND_URL = 'http://irshad-ecommerce-frontend-2025.s3-website.eu-north-1.amazonaws.com';

app.use(cors({ origin: S3_FRONTEND_URL }));

     app.use('/products', productRoutes);

     const port = process.env.PORT || 5000;
     app.listen(port, () => console.log(`Server running on port ${port}`));
