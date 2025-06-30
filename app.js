const express = require('express');
const cors = require('cors');
const app = express();
const petRoutes = require('./routes/petRoutes');
const errorHandler = require('./middleware/errorHandler');

app.use(cors());
app.use(express.json());
app.use('/api/pets', petRoutes);
app.use(errorHandler);

app.get('', (req, res) => {
  res.send('Welcome to the Taily API');
});

module.exports = app;
