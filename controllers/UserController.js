import User from './../models/user.js'
import express from 'express'
import bcrypt from 'bcrypt'

const userRouter = express.Router()

userRouter.post('/add',async (req,res)=>{
    try{
        const{
            username,
            password
        } = req.body

        var saltRounds=10
        const hashedPw = await bcrypt.hash(password, saltRounds)

        const newUser = new User ({
            "username":username,
            "password": hashedPw
        })

        const createdUser = await newUser.save()

        res.status(201).json(createdUser)
    }

    catch(error){
        res.status(500).json({error : error})
    }
})

userRouter.get('/data', async (req,res)=>{
    const data = await User.find({})
    if(data){
        res.json(data)
    } else {
        res.status(404).json({
            message:'Data not found'
        })
    }
})

userRouter.put('/update/:id', async (req,res)=>{
    const {
        username,
        password
    }=req.body
    var saltRounds=10
    const hashedPw = await bcrypt.hash(password, saltRounds)
    const update= await User.findById(req.params.id)
    if (update){
        update.username=username,
        update.password=hashedPw

        const updateData= await update.save()
        res.json('Update Success')
        //res.json(updateData)
    } else {
        res.status(404).json({
            message :'User not found'
        })
    }
})

userRouter.delete('/delete/:id', async(req,res)=>{
    const data= await User.findById(req.params.id)
    if(data && data!==0){
        await data.remove()
        res.json({
            message:'data removed'
        })
    } else {
        res.status(404).json({
            message:'data not found'
        })
    }
})

userRouter.delete('/delete', async(req,res)=>{
    const data= await User
    if(data && data!==0){
        await data.remove()
        res.json({
            message:'data removed'
        })
    } else {
        res.status(404).json({
            message:'data not found'
        })
    }
})

//login
userRouter.post('/login', async (req, res) => {
    try{

        const{
            username,
            password
        } = req.body;
        
        const currentUser = await new Promise((resolve, reject) =>{
            User.find({"username": username}, function(err, user){
                if(err)
                    reject(err)
                resolve(user)
            })
        })
        
        //cek apakah ada user?
       if(currentUser[0]){
            //check password
            bcrypt.compare(password, currentUser[0].password).then(function(result) {
                if(result){
                    //urus token disini
                    res.status(201).json({"status":"logged in!"});
                }
                else
                    res.status(201).json({"status":"wrong password."});
            });
        }
        else{
            res.status(201).json({"status":"username not found"});
        }

    }
    catch(error){
        res.status(500).json({ error: error})
    }
})

export default userRouter