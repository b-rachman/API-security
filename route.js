import express from 'express'
import Homework from './database.js'
const router=express.Router()

//@desc Create New Homework
//@route POST /api/homework
router.post('/homework', async (req,res)=>{
    try {

        const {course, title, due_date, status }=req.body

        const homework = new Homework ({
            course,
            title,
            due_date,
            status,
        })

        const createdHomework = await homework.save()

        res.status(201).json(createdHomework)

    } catch (err) {
        res.status(500).json({ error: 'Database creation was failed'})
    }
})

//@desc Get All Homework
//@route GET /api/homework
router.get('/homework', async (req,res)=>{
    const homework=await Homework.find({})
    if(homework){
        res.json(homework)
    } else {
        res.status(404).json({
            message:'Homework not found'
        })
    }
})

//@desc Get a homework
//@route GET /api/homework
router.get('/homework/:id',async (req,res)=>{
    const homework = await Homework.findById(req.params.id)

    if(homework){
        res.json(homework)
    } else {
        res.status(404).json({
            message:'Homework not found'
        })
    }
})

router.put('/homework/:id',async (req,res)=>{
    const{
        course,
        title,
        due_date,
        status,
    } = req.body

    const homework= await Homework.findById(req.params.id)
    if (homework){
        homework.course=course
        homework.title=title
        homework.due_date=due_date
        homework.status=status

        const updateHomework = await homework.save()
        res.json(updateHomework)
    } else {
        res.status(404).json({
            message :'homework not found'
        })
    }
})

router.delete('/homework/:id', async (req,res)=>{
    const homework= await Homework.findById(req.params.id)
    if(homework && homework!==0){
        await homework.remove()
        res.json({
            message:'homework removed'
        })
    } else {
        res.status(404).json({
            message:'homework not found'
        })
    }
})
export default router
