import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/styles.css';
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';

function About() {
  const navigate = useNavigate();
  const { masterId } = useParams();

  const handleShowTable = () => {
    navigate('/')
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/result-check/${masterId}`);
        const data = await response.json();
        setResultData(data);
        setShowModal(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [masterId]);


  console.log(masterId, "Master Id")

  return (
    <div className="container mt-4" style={{ position: "relative" }}>
      <div className="back-button" onClick={handleShowTable}>
        <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '10px' }} />
        <span style={{ fontWeight: "700" }}>Back</span>
      </div>
      <div className="d-flex justify-content-center text-center">
        <h1 className="header-title">Biomarkers</h1>
      </div>
      <div className="container content-container">
        <div className="p-4">
          <div>
            <label htmlFor="" className="my-2 label-weight">Name:</label>
            <p>SHIB</p>
          </div>
          <div>
            <label htmlFor="" className="my-2 label-weight">Measurement:</label>
            <p>SHIB</p>
          </div>
          <div>
            <label htmlFor="" className="my-2 label-weight">Description:</label>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse quasi, molestias non molestiae id ducimus!
              Iure recusandae tempore veritatis, ipsam asperiores fuga corporis error soluta impedit animi possimus porro illum.</p>
          </div>
          <div>
            <label htmlFor="" className="my-2 label-weight">Methods of Decrease:</label>
            <p>weight loss and exercise</p>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="row table-header-row">
                <div className="col-sm-1"><strong>Group</strong></div>
                <div className="col-sm-2"><strong>Age</strong></div>
                <div className="col-sm-3"><strong>Reference Low</strong></div>
                <div className="col-sm-2"><strong>Reference High</strong></div>
                <div className="col-sm-2"><strong>Optional Low</strong></div>
                <div className="col-sm-2"><strong>Optional High</strong></div>
              </div>
              {[1, 2, 3, 4].map((item, index) => (
                <div key={index} className="row table-content-row">
                  <div className="col-sm-1">{item}</div>
                  <div className="col-sm-2">Biomarker {item}</div>
                  <div className="col-sm-3">Unit {item}</div>
                  <div className="col-sm-2">Category {item}</div>
                  <div className="col-sm-2">Unit {item}</div>
                  <div className="col-sm-2">Category {item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default About;
