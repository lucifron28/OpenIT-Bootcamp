import { useState, useEffect } from 'react'
import Service from '../Service.jsx'

const Forms = (props) => {
    const [students, setStudents] = useState([{ firstName: 'default', lastName: 'default' }]);

    const fetchStudents = async () => {
        try {
            const data = await Service.getStudents();
            setStudents(data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        props.setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div>
            <h2>Forms</h2>
            <input 
                type="text" 
                name="firstName" 
                value={props.formData.firstName} 
                onChange={handleChange} 
             />
           <h2>{props.formData.firstName}</h2> 
           <input 
                type="text" 
                name="lastName" 
                value={props.formData.lastName} 
                onChange={handleChange} 
             />
              <h2>{props.formData.lastName}</h2>
        </div>
    );
}

export default Forms;