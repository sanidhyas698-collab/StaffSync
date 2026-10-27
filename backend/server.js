
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

let employees = [
  { id: 1, name: 'Rahul Sharma', role: 'HR Manager', department: 'Human Resources', status: 'Active' },
  { id: 2, name: 'Priya Verma', role: 'Frontend Developer', department: 'Engineering', status: 'Active' },
  { id: 3, name: 'Amit Patel', role: 'UI/UX Designer', department: 'Design', status: 'Active' },
]

let leaves = [
  { id: 1, name: 'Priya Verma', type: 'Casual Leave', days: 2, status: 'Pending' },
  { id: 2, name: 'Amit Patel', type: 'Sick Leave', days: 1, status: 'Pending' },
]

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to StaffSync API!' })
})

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'StaffSync backend is healthy' })
})

app.get('/api/employees', (req, res) => {
  res.json(employees)
})

app.post('/api/employees', (req, res) => {
  const { name, role, department } = req.body

  if (!name || !role || !department) {
    return res.status(400).json({ message: 'Name, role and department are required' })
  }

  const employee = {
    id: Date.now(),
    name,
    role,
    department,
    status: 'Active',
  }

  employees.push(employee)
  res.status(201).json(employee)
})

app.delete('/api/employees/:id', (req, res) => {
  const id = Number(req.params.id)
  employees = employees.filter(employee => employee.id !== id)
  res.json({ success: true, message: 'Employee deleted' })
})

app.get('/api/leaves', (req, res) => {
  res.json(leaves)
})

app.patch('/api/leaves/:id', (req, res) => {
  const leave = leaves.find(item => item.id === Number(req.params.id))

  if (!leave) {
    return res.status(404).json({ message: 'Leave request not found' })
  }

  leave.status = req.body.status
  res.json(leave)
})

app.listen(PORT, () => {
  console.log(`StaffSync server running on http://localhost:${PORT}`)
})
