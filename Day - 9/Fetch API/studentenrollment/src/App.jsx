import { useState, useEffect } from 'react'
import Students from './components/Students.jsx' 
import Forms from './components/Forms.jsx'
import './App.css'

function App() {
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({ firstName: '', lastName: '' });

  const fetchPrograms = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/programs');
      const data = await response.json();
      setPrograms(data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  }
  useEffect(() => {
    fetchPrograms();
  }, []);
  return (
    <>
      {programs.map((p) => (
        <div key={p.id}>
          <h2>{p.name}</h2>
        </div>
      ))}

      <Students />


      <Forms formData={formData} setFormData={setFormData} />
    </>
  )
}

export default App
