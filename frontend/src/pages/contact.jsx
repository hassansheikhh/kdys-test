import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function Contact() {
  const { masterId } = useParams();
  const canvasRef = useRef(null);
  const [groupDetails, setGroupDetails] = useState([]);
  const [group, setGroup] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const [age, setAge] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [formData, setFormData] = useState({
    refMin: '',
    refMax: '',
    optMin: '',
    optMax: '',
    result: '',
    masterId: masterId,
  });

  useEffect(() => {
    fetch('http://localhost:3000/GetAllGroupDetails')
      .then(response => response.json())
      .then(data => setGroupDetails(data));
  }, []);

  useEffect(() => {
    const filtered = groupDetails.filter(detail => {
      return detail.group === group && detail.age === age;
    });
    setFilteredData(filtered);
  }, [group, age, groupDetails]);

  console.log(filteredData, "Filtered Data")

  console.log(groupDetails, "groupDetails")
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const results = groupDetails.map(detail => {
      const { reference_low, reference_high, optimal_high, optimal_low } = detail;
      const refLow = parseInt(reference_low);
      const refHigh = parseInt(reference_high);
      const optHigh = parseInt(optimal_high);
      const optLow = parseInt(optimal_low);
      return refLow + refHigh + optHigh + optLow;
    });

    const dates = groupDetails.map(detail => detail.date);

    const maxResult = Math.max(...results);
    const increasedMaxResult = maxResult * 1.05;

    const colorRanges = [
      { range: [0, 10], color: 'red' },
      { range: [11, 20], color: 'yellow' },
      { range: [21, 47], color: 'green' },
      { range: [48, 57], color: 'yellow' },
      { range: [58, increasedMaxResult], color: 'red' }
    ];

    ctx.fillStyle = 'rgba(211, 211, 211, 0.3)';
    ctx.fillRect(0, 0, width, height);

    colorRanges.forEach(({ range, color }, index) => {
      const [start, end] = range;
      const startY = height - (end / increasedMaxResult) * height;
      const endY = height - (start / increasedMaxResult) * height;

      ctx.fillStyle = color;
      ctx.fillRect(0, startY, width, endY - startY);

      ctx.fillStyle = 'white';
      ctx.textAlign = 'right';
      ctx.fillText(`${start}-${end}`, -5, startY + 15);
    });

    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.strokeStyle = 'white';
    const interval = width / (results.length - 1);
    const amplitude = 0;
    const frequency = 0.1;
    results.forEach((result, index) => {
      const x = index * interval;
      const y = height - (result / increasedMaxResult) * height + amplitude * Math.sin(frequency * x);
      ctx.lineTo(x, y);
    });

    ctx.stroke();

    results.forEach((result, index) => {
      const x = index * interval;
      const y = height - (result / increasedMaxResult) * height + amplitude * Math.sin(frequency * x);
      const circleRadius = 5;

      let circleColor = '';
      if (result >= 0 && result <= 10) circleColor = 'red';
      if (result >= 11 && result <= 20) circleColor = 'yellow';
      if (result >= 21 && result <= 47) circleColor = 'green';
      if (result >= 48 && result <= 57) circleColor = 'yellow';
      if (result >= 58) circleColor = 'red';

      if (circleColor) {
        ctx.fillStyle = circleColor;
        ctx.beginPath();
        ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    dates.forEach((date, index) => {
      const x = index * interval;
      ctx.fillText(date, x, height + 20);
    });
  }, [groupDetails]);

  const handleShowTable = () => {
    navigate('/')
  }
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
    <>

      <div className="container position-relative mt-4">
        <div className="back-button" onClick={handleShowTable}>
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '10px' }} />
          <span style={{ fontWeight: "700" }}>Back</span>
        </div>
      </div>
      <div className="text-center mb-4">
        <h1>Biomakers</h1>
      </div>
      <div className="container mt-4  radius-container">
        <div className="text-center mb-4">
          <h2>Test Result</h2>
        </div>
        <div className="row justify-content-center mb-4">
          <div className="col-md-2">
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="form-control mx-2"
            >
              <option value="">Select Group</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="col-md-2">
            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="form-control"
            >
              <option value="">Select Age</option>
              <option value="0-18">0-18</option>
              <option value="19-49">19-49</option>
              <option value="50+">50+</option>
            </select>
          </div>
          <div className="col-md-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="form-control"
            />
          </div>
        </div>
        <div className='text-center my-4'>
          <h3>Calories Burned<span className='calories'> 1500 calories</span></h3>
          <p className='calories-desc '>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius, facilis asperiores ut eveniet porro, dignissimos praesentium numquam magnam reprehenderit nihil iste et repudiandae eaque sapiente explicabo nemo assumenda ullam obcaecati!</p>
        </div>
        <form onSubmit={handleSubmit} className="d-flex flex-row align-items-center">
          {filteredData.map((data, index) => (
            <div key={index} className="mb-3 w-100 d-flex">
              {['reference_low', 'reference_high', 'optimal_low', 'optimal_high'].map((field, fieldIndex) => (
                <div key={fieldIndex} className="w-100 d-flex">
                  <label
                    className="mb-1 w-100 d-flex justify-content-center align-items-center"
                    style={{ fontWeight: 'bold' }}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={data[field]}
                    disabled
                    onChange={(e) => handleInputChange(e, index)}
                    className="form-control text-center"
                  />
                </div>
              ))}
            </div>
          ))}
        </form>
      </div>

      <div className="container radius-container mt-4">
        <div className="m-3">
          {/* <h1>Custom Chart</h1> */}
          <canvas ref={canvasRef} width={700} height={400} style={{ border: '1px solid black' }} />
        </div>
      </div>
    </>
  );
}

export default Contact;


