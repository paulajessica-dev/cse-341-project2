
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

app.use(cors());
app.use(express.json());

const port = 3001
const secret = process.env.SECRET_KEY

app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

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

app.use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}));
app.use(cors({ origin: '*'}));

app.use('/', require('./routes/index'));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done){
    //User.findOrCreate({ gitHubId: profile.Id }, function (err, user) {
    return done(null, profile)
//})
}
));

passport.serializeUser((user, done) => {
    done(null,user);
});
passport.deserializeUser((user, done) => {
    done(null,user);
});


app.use(swaggerRouter);   
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/index'));
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

