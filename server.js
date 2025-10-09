const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongodb = require('./data/database');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const swaggerRouter = require('./routes/swagger');

const port = 3001;
const secret = process.env.SECRET_KEY;

//middlewares
app.use(express.json());
app.use(bodyParser.json());

app.set('trust proxy', 1);

//session before passport
app.use(session({
  secret: process.env.SECRET_KEY || 'defaultsecret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true, // impede acesso via JS
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
  }
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

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

const allowedOrigins = [
  'http://localhost:3001',
  'https://cse-341-project2-7v19.onrender.com'
];

//cors
app.use(cors({
  origin: function(origin, callback){
    // permite requests sem origin (ex: Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS','PATCH'],
  allowedHeaders: ['Content-Type','Authorization']
}));

//routes
app.use('/', swaggerRouter);
app.use('/', require('./routes'));
app.use('/swagger.json', express.static('./swagger.json'));

//gitHub strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done){
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get('/', (req, res) => {
  const user = req.session.user;
  console.log('Sessão atual:', req.session);
  if (user) {
    res.send(`Logged in as ${user.displayName || user.username}`);
  } else {
    res.send('Logged Out');
  }
});

app.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

process.on('uncaughtException', (err, origin) => {
  console.error('Unhandled exception:', err);
  console.error('Origin:', origin);
  process.exit(1);
});

//data + server
mongodb.iniDb((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Database connected');
    app.listen(process.env.PORT || port, () => {
      console.log('Server running on port ' + (process.env.PORT || port));
    });
  }
});
