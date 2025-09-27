
const express = require('express');
const mongodb = require('./data/database');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usersController = require('./controllers/users');
const { addTokenToBlacklist } = require('./models/blacklist');
const swaggerRouter = require('./routes/swagger');


// Practical flow:
// User registers → /register → receives a token.
// User logs in → /login → receives a new token.
// User accesses protected routes → /profile → token is valid.
// User logs out → /logout → token becomes invalid.
// User tries to access a protected route again → /profile → receives 401 error → needs to log in again.


app.use(cors());
app.use(express.json());

const port = 3001
const secret = process.env.SECRET_KEY

//
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-type, Accept, Z-Key, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods', 
        'GET,POST,PUT,DELETE,OPTIONS');
    next();
});

app.use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}));
app.use(cors({ origin: '*'}));

//register user route: add user if user doesn't exist
app.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, favoriteColor, birthday } = req.body;
        
        if (!firstName) return res.status(422).json({ message: 'First name is required!' });
        if (!lastName) return res.status(422).json({ message: 'Last name is required!' });
        if (!email) return res.status(422).json({ message: 'E-mail is required!' });
        if (!password) return res.status(422).json({ message: 'Password is required!' });

        const db = mongodb.getDatabase();
       
        let userExists = await db.collection('users').findOne({ email });

        if (!userExists) {
            user = await usersController.createUser({ firstName, lastName, email, password, favoriteColor, birthday });

            return res.status(201).json({
                message: 'User created successfully!',
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email                  
                }
            })

        }else {
            return res.status(409).json({ message: 'User already exists' })
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//login user route: verify email and password from user, if they matche and create token from him
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email) return res.status(422).json({ message: 'E-mail is required!' });
        if (!password) return res.status(422).json({ message: 'Password is required!' });

        const db = mongodb.getDatabase();
        
        const userExists = await db.collection('users').findOne({ email });
        if (!userExists) {
            return res.status(401).json({ message: 'Invalid email' });
        }
        const passwordMatch = await bcrypt.compare(password, userExists.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }    
        
        const token = jwt.sign({ id: userExists._id }, secret, { expiresIn: '1h' });            
        return res.status(200).json({
            message: 'Authenticated successfully',
            token,
            user: {
                firstName: userExists.firstName,
                lastName: userExists.lastName,
                email: userExists.email
            }
        });  

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//logout user route: add user token in tokenBlacklist to that user can only login again with other token
app.post('/logout', async (req, res) => {    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ message: 'Token required for logout' });
        }
        await addTokenToBlacklist(token);
        return res.status(200).json({ message: 'Logged out successfully, token blacklisted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.use(swaggerRouter);   
app.use('/', require('./routes'));
process.on('uncaughtException', (err, origin) => {
  console.error('Unhandled exception:', err);
  console.error('Origin:', origin);
  process.exit(1); 
});

mongodb.iniDb((err) => {
    if (err){
        console.log(err);
    } else {
        console.log('Database connected');
        app.listen(process.env.PORT || port, () => {
            console.log('Server running on port ' + (process.env.PORT || port));
        });
    }
});

