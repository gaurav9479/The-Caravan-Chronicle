import 'dotenv/config'
import mongoose from 'mongoose'
import Department from '../models/Department.js'
import User from '../models/User.js'

async function run() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected')

  const departments = [
    { name: 'Roads', code: 'ROADS', categoriesHandled: ['Road Damage'], slaPolicyHours: 48 },
    { name: 'Water', code: 'WATER', categoriesHandled: ['Water Leakage'], slaPolicyHours: 24 },
    { name: 'Sanitation', code: 'SAN', categoriesHandled: ['Garbage'], slaPolicyHours: 36 },
    { name: 'Other', code: 'OTHER', categoriesHandled: ['Other'], slaPolicyHours: 72 },
  ]
  await Department.deleteMany({})
  const createdDepts = await Department.insertMany(departments)
  console.log('Departments seeded')

  const byCode = Object.fromEntries(createdDepts.map(d=>[d.code,d]))

  await User.deleteMany({ role: { $in: ['staff'] } })
  const staff = [
    { name: 'Rohan Roads', email: 'rohan.roads@example.com', password: 'ChangeMe123!', role: 'staff', departmentId: byCode.ROADS._id, staff:{ title:'Field Engineer', skills:['paving'] }},
    { name: 'Wendy Water', email: 'wendy.water@example.com', password: 'ChangeMe123!', role: 'staff', departmentId: byCode.WATER._id, staff:{ title:'Plumber', skills:['pipes','valves'] }},
    { name: 'Sanjay Sanitation', email: 'sanjay.san@example.com', password: 'ChangeMe123!', role: 'staff', departmentId: byCode.SAN._id, staff:{ title:'Cleaner', skills:['waste'] }},
  ]
  await User.insertMany(staff)
  console.log('Staff seeded')
  await mongoose.disconnect()
}

run().catch(e=>{ console.error(e); process.exit(1) })


