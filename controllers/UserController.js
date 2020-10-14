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