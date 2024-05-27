import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';

function Contact() {
  const { masterId } = useParams();

  const [startDate, setStartDate] = useState(new Date());
  const [formData, setFormData] = useState({
    refMin: '',
    refMax: '',
    optMin: '',
    optMax: '',
    result: '',
    masterId: masterId,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      date: startDate
    };

    const response = await fetch('http://localhost:3000/result-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSubmit),
    });

    if (response.ok) {
      alert('Data submitted successfully');
    } else {
      alert('Error submitting data');
    }
  };

  return (
    <div className="container mt-4 radius-container">
      <div className="text-center mb-4">
        <h2>Test Result</h2>
      </div>
      <div className="d-flex justify-content-center mb-4">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          className="form-control"
        />
      </div>
      <div className='text-center my-4'>
        <h3>Calories Burned<span className='calories'> 1500 calories</span></h3>
        <p className='calories-desc '>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius, facilis asperiores ut eveniet porro, dignissimos praesentium numquam magnam reprehenderit nihil iste et repudiandae eaque sapiente explicabo nemo assumenda ullam obcaecati!</p>
      </div>
      <form onSubmit={handleSubmit} className="d-flex flex-row align-items-center">
        {['refMin', 'refMax', 'optMin', 'optMax', 'result'].map((field, index) => (
          <div key={index} className="mb-3 w-50 d-flex">
            <label
              className="d-flex text-center mb-1 w-100"
              style={{ fontWeight: 'bold' }}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleInputChange}
              className="form-control text-center"
            />
          </div>
        ))}
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default Contact;
