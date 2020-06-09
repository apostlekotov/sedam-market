const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const sales = require('./routes/sales');
const products = require('./routes/products');
const mail = require('./routes/mail');
const auth = require('./routes/auth');

const app = express();

// Init middlewares
app.use(express.json());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cors());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 100
});

app.use(limiter);

// Mount routes
app.use('/api/sales', sales);
app.use('/api/products', products);
app.use('/api/sendmail', mail);
app.use('/api/auth', auth);

app.use(errorHandler);

// Set static folder
app.use(express.static('client/build'));

app.get('/*', (req, res) => 
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} made on port ${PORT}`.yellow.bold
  )
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error ${err.message}`.red);
  // server.close(() => process.exit(1));
});
