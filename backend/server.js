import app from './src/app.js'
import connectDB from './src/config/database.js';

connectDB();

app.get('/', (req, res) => {
    res.send('Welcome to the Snitch API');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})