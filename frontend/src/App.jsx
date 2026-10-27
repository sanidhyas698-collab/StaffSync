
import { useEffect, useState } from 'react'
import './App.css'

const API = 'http://localhost:5000/api'

function App() {
  const [employees, setEmployees] = useState([])
  const [leaves, setLeaves] = useState([])
  const [page, setPage] = useState('Dashboard')
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '',
    role: '',
    department: '',
  })

  async function loadData() {
    try {
      const [employeeRes, leaveRes] = await Promise.all([
        fetch(`${API}/employees`),
        fetch(`${API}/leaves`),
      ])
      setEmployees(await employeeRes.json())
      setLeaves(await leaveRes.json())
    } catch {
      alert('Backend is not running. Please start the backend server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function addEmployee(e) {
    e.preventDefault()
    const response = await fetch(`${API}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (response.ok) {
      setForm({ name: '', role: '', department: '' })
      loadData()
    } else {
      alert('Please fill in all employee details.')
    }
  }

  async function deleteEmployee(id) {
    if (!window.confirm('Delete this employee?')) return
    await fetch(`${API}/employees/${id}`, { method: 'DELETE' })
    loadData()
  }

  async function updateLeave(id, status) {
    await fetch(`${API}/leaves/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    loadData()
  }

  const activeEmployees = employees.filter(e => e.status === 'Active').length
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="brand">StaffSync</h2>
        <p className="muted">HUMAN RESOURCES</p>
        {['Dashboard', 'Employees', 'Leave Requests'].map(item => (
          <button
            key={item}
            className={`nav-link ${page === item ? 'selected' : ''}`}
            onClick={() => setPage(item)}
          >
            {item === 'Dashboard' ? '▦' : item === 'Employees' ? '♙' : '▣'} {item}
          </button>
        ))}
        <div className="sidebar-footer">StaffSync HR Portal</div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h2>{page}</h2>
            <p className="muted">Welcome back! Manage your team here.</p>
          </div>
          <div className="avatar">HR</div>
        </header>

        {loading ? <p>Loading StaffSync data...</p> : (
          <>
            {page === 'Dashboard' && (
              <>
                <section className="stats">
                  <div className="stat-card">
                    <p>Total Employees</p>
                    <h2>{employees.length}</h2>
                  </div>
                  <div className="stat-card">
                    <p>Active Employees</p>
                    <h2>{activeEmployees}</h2>
                  </div>
                  <div className="stat-card">
                    <p>Pending Leaves</p>
                    <h2>{pendingLeaves}</h2>
                  </div>
                </section>

                <section className="panel">
                  <h3>Recent Employees</h3>
                  <EmployeeTable employees={employees.slice(0, 5)} onDelete={deleteEmployee} />
                </section>
              </>
            )}

            {page === 'Employees' && (
              <>
                <section className="panel">
                  <h3>Add New Employee</h3>
                  <form className="employee-form" onSubmit={addEmployee}>
                    <input
                      placeholder="Full name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      required
                    />
                    <input
                      placeholder="Job role"
                      value={form.role}
                      onChange={e => setForm({ ...form, role: e.target.value })}
                      required
                    />
                    <input
                      placeholder="Department"
                      value={form.department}
                      onChange={e => setForm({ ...form, department: e.target.value })}
                      required
                    />
                    <button className="primary" type="submit">Add Employee</button>
                  </form>
                </section>
                <section className="panel">
                  <h3>All Employees ({employees.length})</h3>
                  <EmployeeTable employees={employees} onDelete={deleteEmployee} />
                </section>
              </>
            )}

            {page === 'Leave Requests' && (
              <section className="panel">
                <h3>Leave Management</h3>
                {leaves.length === 0 ? <p>No leave requests found.</p> : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>Employee</th><th>Leave Type</th><th>Days</th><th>Status</th><th>Action</th></tr>
                      </thead>
                      <tbody>
                        {leaves.map(leave => (
                          <tr key={leave.id}>
                            <td>{leave.name}</td>
                            <td>{leave.type}</td>
                            <td>{leave.days}</td>
                            <td><span className="status">{leave.status}</span></td>
                            <td>
                              {leave.status === 'Pending' ? (
                                <div className="actions">
                                  <button onClick={() => updateLeave(leave.id, 'Approved')}>Approve</button>
                                  <button onClick={() => updateLeave(leave.id, 'Rejected')}>Reject</button>
                                </div>
                              ) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function EmployeeTable({ employees, onDelete }) {
  if (employees.length === 0) return <p>No employees yet.</p>

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Employee</th><th>Role</th><th>Department</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.role}</td>
              <td>{employee.department}</td>
              <td><span className="status">{employee.status}</span></td>
              <td><button onClick={() => onDelete(employee.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
