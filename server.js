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

//cors
app.use(cors({
  origin: 'https://cse-341-project2-7v19.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

//session before passport
app.use(session({
  secret: secret || 'defaultsecret',
  resave: false,
  saveUninitialized: true,
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use('/', swaggerRouter);
app.use('/', require('./routes'));

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
  if (user) {
    res.send(`Logged in as ${user.displayName || user.username}`);
  } else {
    res.send('Logged Out');
  }
});

app.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs', session: false }),
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
