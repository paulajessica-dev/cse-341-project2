
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongodb = require('./data/database'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const swaggerRouter = require('./routes/swagger');
const routes = require('./routes'); 

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.set('trust proxy', 1);


app.use(
  session({
    secret: process.env.SECRET_KEY || 'defaultsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: true, 
      sameSite: 'none', 
    },
  })
);


app.use(
  cors({
    origin: 'https://cse-341-project2-7v19.onrender.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);


passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'https://cse-341-project2-7v19.onrender.com/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(passport.initialize());
app.use(passport.session());


function isAuthenticated(req, res, next) {
  if (req.isAuthenticated() || req.session.user) return next();
  return res.status(401).json('You do not have access.');
}


app.use('/', swaggerRouter); 
app.use('/', routes); 
app.use('/swagger.json', express.static('./swagger.json'));


app.get('/github', passport.authenticate('github'));
app.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);


app.get('/', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.send(`Logged in as ${user.displayName || user.username}`);
  } else {
    res.send('Logged Out');
  }
});


mongodb.iniDb((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
});
