import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import RangeSlider from './Slider';

function Contact() {
  const navigate = useNavigate();
  const { masterId } = useParams();
  const canvasRef = useRef(null);
  const [groupDetails, setGroupDetails] = useState([]);
  const [resultsFromBiomaker, setResultsFromBiomaker] = useState([]);
  const [group, setGroup] = useState('');
  const [biomarkerResult, setBiomarkerResult] = useState('');
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
  const results = [
    { date: '2024-05-09', value: 11 },
    { date: '2024-05-08', value: 45 },
    { date: '2024-04-20', value: 78 },
    { date: '2024-04-20', value: 5 },
    { date: '2024-04-19', value: 55 },
  ];

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


  useEffect(() => {
    const calculateBiomarkerResult = () => {
      if (filteredData.length > 0) {
        const selectedDetail = filteredData[0];
        const { reference_low, reference_high, optimal_low, optimal_high } = selectedDetail;
        const { refMin, refMax, optMin, optMax } = formData;
        let result = '';
        if (refMin >= reference_low && refMax <= reference_high) {
          result = 'Normal';
        } else if (refMin >= optimal_low && refMax <= optimal_high) {
          result = 'Optimal';
        } else {
          result = 'Abnormal';
        }
        setBiomarkerResult(result);
      }
    };
    calculateBiomarkerResult();
  }, [filteredData, formData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear the canvas before drawing
    ctx.clearRect(0, 0, width, height);

    const results = filteredData.map(detail => {
      const { reference_low, reference_high, optimal_high, optimal_low } = detail;
      const refLow = parseInt(reference_low, 10);
      const refHigh = parseInt(reference_high, 10);
      const optHigh = parseInt(optimal_high, 10);
      const optLow = parseInt(optimal_low, 10);
      return refLow + refHigh + optHigh + optLow;
    });

    console.log(results, "Result");

    setResultsFromBiomaker(results);

    if (results.length === 0) return;

    const dates = filteredData.map(detail => detail.create_date);

    const maxResult = Math.max(...results);
    const increasedMaxResult = maxResult * 1.05;

    const colorRanges = [
      { range: [0, 10], color: '#fcd8d8' },
      { range: [11, 20], color: '#fceac6' },
      { range: [21, 47], color: '#d1e5d0' },
      { range: [48, 57], color: '#fceac6' },
      { range: [58, increasedMaxResult], color: '#fcd8d8' }
    ];

    ctx.fillStyle = 'rgba(211, 211, 211, 0.3)';
    ctx.fillRect(0, 0, width, height);

    colorRanges.forEach(({ range, color }) => {
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
    ctx.strokeStyle = 'black';
    const interval = results.length > 1 ? width / (results.length - 1) : width; // Adjust interval if only one data point
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
      const circleRadius = 6;

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
        ctx.strokeStyle = 'transparent';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    const colorRangesY = [
      { range: [0, 10], color: 'red', label: '0' },
      { range: [11, 20], color: 'yellow', label: '10' },
      { range: [21, 47], color: 'green', label: '20' },
      { range: [48, 57], color: 'yellow', label: '47' },
      { range: [58, increasedMaxResult], color: 'red', label: '57+' }
    ];

    colorRangesY.forEach(({ range, label }) => {
      const [start, end] = range;
      const startY = height - (end / increasedMaxResult) * height;
      ctx.textAlign = 'left';
      ctx.fillStyle = 'black';
      ctx.fillText(label, 2, startY + 10);
    });

    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    const labelYPosition = height + 20; // Adjusted position for better visibility
    dates.forEach((date, index) => {
      const x = index * interval;
      ctx.fillText(date, x, labelYPosition);
    });
  }, [filteredData]);

  const handleShowTable = () => {
    navigate('/')
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  console.log(resultsFromBiomaker)


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
                    className=" w-100 d-flex justify-content-center align-items-center"
                    style={{ fontWeight: 'bold', fontSize: '14px', border: '2px solid #80898e', margin: "5px", padding: '10px', borderRadius: '5px', backgroundColor: '#b5e1ff' }}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}<span style={{ color: '#80898e' }}>{' <'} </span>
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={data[field]}
                    disabled
                    onChange={(e) => handleInputChange(e, index)}
                    className="form-control text-center m-1"
                  />
                </div>
              ))}
            </div>
          ))}
        </form>
        {filteredData.length > 0 ?
          <div className='col-md-12  d-flex justify-content-center'>
            <div className='col-md-2 d-flex'>
              <label
                className="mb-1 w-100 d-flex justify-content-center align-items-center"
                style={{ fontWeight: 'bold', fontSize: '14px', border: '2px solid #80898e', margin: "5px", padding: '10px', borderRadius: '5px', backgroundColor: '#b5e1ff' }}
              >  Result <span style={{ color: '#80898e', fontWeight: 'bold' }}>{' <'} </span> </label>
              <input
                type="text"
                name="result"
                value=""
                disabled
                onChange={(e) => handleInputChange(e, index)}
                className="form-control text-center m-1"
              />
            </div>
          </div>
          : null}

      </div>

      <div className="container radius-container mt-4 col-md-12">
        <div className='custom-con'>

          <div className='d-flex justify-content-space-between col-md-12 custom-con '>
            <div className=''>
              <h2 className='biomaker-heading'>SHBG</h2>
              <p className='biomaker-paragraph'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, tenetur dicta? Ab repellendus sed beatae excepturi ea laborum ex officiis, molestias consequuntur laudantium corrupti minima pariatur aliquid necessitatibus consectetur cum!</p>
            </div>
            <div className='col-md-6'>
              <RangeSlider resultsFromBiomaker={resultsFromBiomaker} />
            </div>
          </div>
          <div className='d-flex col-md-12'>
            <div className=" m-3 col-md-6">
              <canvas ref={canvasRef} width={500} height={250} style={{ border: '1px solid black' }} />
            </div>
            <div className='col-md-6'>
              <div className="container w-50">
                <div className="text-center mb-4">
                  <h5 className="text-muted">Result History</h5>
                </div>
                <table className="table table-borderless">
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index}>
                        <td>{result.date}</td>
                        <td className="text-primary text-end">{result.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;


