const express = require('express');
const cors = require('cors');
const app = express();
const petRoutes = require('./routes/petRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

app.use(cors());
app.use(express.json());
app.use('/api/pets', petRoutes);
app.use('/api/users', userRoutes);
app.use(errorHandler);

app.get('', (req, res) => {
  res.send('Welcome to the Taily API');
});

module.exports = app;
