const express = require('express')
const session = require('express-session')
const app = express()

app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: '124447yd@@$%%#', cookie: { maxAge: 60000 }, saveUninitialized: false, resave: false }))

app.use(express.static('public'))

const adminController = require('./controllers/admin')
const { checkUserRole } = require('./databaseHandler')

//cac request co chua /admin se di den controller admin
app.use('/admin', adminController)

app.get('/',requiresLogin,(req,res)=>{
    const user = req.session["User"]
    res.render('index',{userInfo:user})
    
})

app.get('/login',(req,res)=>{
    res.render('loginpage')
})

app.post('/login',async (req,res)=>{
    const name = req.body.txtName
    const pass = req.body.txtPass
    const role = await checkUserRole(name, pass)
    if (role == -1) {
        //res.render('loginpage')
        res.redirect('/login')
    } else {
        req.session["User"] = {
            name: name,
            role: role
        }
        console.log("Ban dang dang nhap voi quyen la: " + role)
        res.redirect('/')
    }
})

//custom middleware
function requiresLogin(req,res,next){
    if(req.session["User"]){
        return next()
    }else{
        res.redirect('/login')
    }
}

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log("Server is running! " + PORT)