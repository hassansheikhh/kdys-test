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


  console.log(groupDetails, "groupDetails")
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Calculate results based on groupDetails
    const results = groupDetails.map(detail => {
      const { reference_low, reference_high, optimal_high, optimal_low } = detail;
      const refLow = parseInt(reference_low);
      const refHigh = parseInt(reference_high);
      const optHigh = parseInt(optimal_high);
      const optLow = parseInt(optimal_low);
      return refLow + refHigh + optHigh + optLow;
    });

    // Calculate the maximum value in the results array
    const maxResult = Math.max(...results);

    // Increase the maximum value by 5%
    const increasedMaxResult = maxResult * 1.05;

    // Adjust the color range to accommodate the increased maximum value
    const colorRanges = [
      { range: [0, 10], color: 'red' },
      { range: [11, 20], color: 'yellow' },
      { range: [21, 47], color: 'green' },
      { range: [48, 57], color: 'yellow' },
      { range: [58, increasedMaxResult], color: 'red' } // Adjusted to increasedMaxResult
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
      ctx.textAlign = 'left';
      ctx.fillText(`${start}-${end}`, 0, startY + 15 * (index + 1));
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

    // Draw the line graph after defining its path
    ctx.stroke();

    // Draw yellow circles on the line where the value falls in the range of 11 to 20
    results.forEach((result, index) => {
      const x = index * interval;
      const y = height - (result / increasedMaxResult) * height + amplitude * Math.sin(frequency * x);

      if (result >= 0 && result <= 10) {
        ctx.fillStyle = 'red';
        const circleRadius = 5;
        ctx.beginPath();
        ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'black'; // Border color
        ctx.lineWidth = 2; // Border width
        ctx.stroke();
      }
      if (result >= 11 && result <= 20) {
        ctx.fillStyle = 'yellow';
        const circleRadius = 5;
        
        ctx.beginPath();
        ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'black'; // Border color
        ctx.lineWidth = 2; // Border width
        ctx.stroke();
      }
      if (result >= 21 && result <= 47) {
        ctx.fillStyle = 'green';
        const circleRadius = 5;
        ctx.beginPath();
        ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'black'; 
        ctx.lineWidth = 2; 
        ctx.stroke();
      }
      if (result >= 47 && result <= 57) {
        ctx.fillStyle = 'yellow';
        const circleRadius = 5;
        ctx.beginPath();
        ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'black'; 
        ctx.lineWidth = 2; 
        ctx.stroke();
      }
      if (result >= 47 ) {
        ctx.fillStyle = 'red';
        const circleRadius = 5;
        ctx.beginPath();
        ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'black'; 
        ctx.lineWidth = 2; 
        ctx.stroke();
      }
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

      <div className="container mt-4 radius-container">
        <div className="back-button" onClick={handleShowTable}>
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '10px' }} />
          <span style={{ fontWeight: "700" }}>Back</span>
        </div>
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
          {/* <button type="submit" className="btn btn-primary">Submit</button> */}
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


