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

app.get('/shopping',(req,res)=>{
    res.render('showproducts')
})

app.post('/buy',(req,res)=>{
    //xem nguoi dung mua gi: Milk hay Coffee
    const product = req.body.product
    //lay gio hang trong session
    let cart = req.session["cart"]
    //chua co gio hang trong session, day se la sp dau tien
    if(!cart){
        let dict = {}
        dict[product] = 1
        req.session["cart"] = dict
        console.log("Ban da mua:" + product + ", so luong: " + dict[product])
    }else{
        dict = req.session["cart"]
        //co lay product trong dict
        var oldProduct = dict[product]
        //kiem tra xem product da co trong Dict
        if(!oldProduct)
            dict[product] = 1
        else{
            dict[product] = parseInt(oldProduct) +1
        }
        req.session["cart"] = dict
        console.log("Ban da mua:" + product + ", so luong: " + dict[product])
    }

    // if(!req.session[product])
    //     req.session[product] = 1
    // else{
    //     const soLuong =  parseInt(req.session[product]) +1
    //     req.session[product] = soLuong
    // }
    // console.log("Ban vua cap nhat sp" + product + " so luong: " + req.session[product])

    res.render('showproducts')
})

app.get('/viewCart',(req,res)=>{
    const cart = req.session["cart"]
    //Mot array chua cac san pham trong gio hang
    let spDaMua = []
    //neu khach hang da mua it nhat 1 sp
    if(cart){
        const dict = req.session["cart"]
        for(var key in dict) {
            spDaMua.push({tensp: key,soLuong: dict[key]})
         }
    }
    res.render('mycart',{products:spDaMua})
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