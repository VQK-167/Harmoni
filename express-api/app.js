const express = require('express')
const path = require('path')
const session = require('express-session')

const authRoutes = require("./routes/authRoute")
const discoverRoutes = require("./routes/discoverRoute")
const matchRoutes = require("./routes/matchRoute")
const messageRoutes = require("./routes/messageRoute")
const profileRoutes = require("./routes/profileRoute")

const {
    usesession
} = require("./middlewares/authMiddleware")

const app = express()
const port = 3000

app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false
}));

app.use(usesession);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

function logger(req, res, next) {
    console.log(req.method, req.url);
    next();
}

app.use(logger);

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
})

app.use("/", authRoutes)

app.use("/discover", discoverRoutes)

app.use("/matches", matchRoutes)

app.use("/messages", messageRoutes)

app.use("/profile", profileRoutes)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
