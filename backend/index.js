const dotenv = require('dotenv')
dotenv.config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const express = require('express');
const app = express();
const connectDb = require('./src/config/db.config');

app.use(
  cors({
      origin : 'http://localhost:5173',
      credentials : true,
  })
)

app.use(cookieParser())

const aiRoute = require('./src/routes/ai.routes');
const authRoute = require('./src/routes/auth.routes');

PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/ai-route',aiRoute);
app.use('/api/auth',authRoute);

app.listen(PORT , ()=>{
  console.log(`Server is running on the port ${PORT}`);
  connectDb();
})