require('dotenv').config();

const express = require('express');
const authRouter = require('./auth/auth');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api/v1/auth', authRouter); // Mount auth router to app

app.listen(port, () => {
  console.log(`CRM Backend is live and listening on port ${port}`);
});