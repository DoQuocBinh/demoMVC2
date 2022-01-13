const express = require('express')
const app = express()

app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

const adminController = require('./controllers/admin')
//cac request co chua /admin se di den controller admin
app.use('/admin', adminController)

app.get('/',(req,res)=>{
    res.render('index')
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log("Server is running! " + PORT)