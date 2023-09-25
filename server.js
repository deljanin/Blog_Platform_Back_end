const express = require('express');
const app = express();
const authRoutes = require('./app/routes/authRoutes');
const blogRoutes = require('./app/routes/blogRoutes');
const commentRoutes = require('./app/routes/commentRoutes');
const postRoutes = require('./app/routes/postRoutes');
const likeRoutes = require('./app/routes/likeRoutes');

app.use(express.json());

// Use the authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/post', postRoutes);
app.use('/api/like', likeRoutes);

const PORT = process.env.PORT || 7475;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
