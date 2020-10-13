import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'

import router from './route.js'

//Connect Database

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
},()=>{
    console.log('Connect Database success')
})

const app=express()

//Middleware
app.use(morgan('dev'))
app.use(express.json())

//Routes
app.get('/', (req,res)=>{
    res.json({
        message: 'success',
    })
})

app.use('/api', router)

app.listen(process.env.PORT,()=>{
    console.log( `App listen to port ${process.env.PORT}`)
})



