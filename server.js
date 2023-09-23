const express = require('express');
const app = express();
const authRoutes = require('./app/routes/authRoutes');
app.use(express.json());

// Use the authentication routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 7475;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
