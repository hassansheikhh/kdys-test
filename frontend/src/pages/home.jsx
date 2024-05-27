import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/styles.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [biomarkers, setBiomarkers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    biomarker: '',
    measurementUnit: '',
    categories: '',
  });

  useEffect(() => {
    fetch('http://localhost:3000/GetBiomarkers')
      .then(response => response.json())
      .then(data => setBiomarkers(data));
  }, []);

  const handleShowTable = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/GetBiomarkersById/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch biomarkers by ID');
      }
      const data = await response.json();
      navigate('/contact', { state: { biomarkers: data } });
    } catch (error) {
      console.error('Error fetching biomarkers by ID:', error);
    }
  };

  const handleViewTable = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/GetBiomarkersById/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch biomarkers by ID');
      }
      const data = await response.json();
      navigate('/about', { state: { biomarkers: data } });
    } catch (error) {
      console.error('Error fetching biomarkers by ID:', error);
    }
  };
  
  const handleShowAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/AddBiomarkers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        setBiomarkers([...biomarkers, data]);
        setShowAddModal(false);
        setFormData({
          biomarker: '',
          measurementUnit: '',
          categories: '',
        });
      });
  };

  return (
    <div className="container mt-4">
      <div className='form-btn'>
        <button className='btn btn-success' onClick={handleShowAddModal}>Add Biomarker</button>
      </div>
      <div className="text-center">
        <h1>Biomarkers</h1>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="row header-row">
            <div className="col-sm-1"><strong>S.No</strong></div>
            <div className="col-sm-2"><strong>Biomarker</strong></div>
            <div className="col-sm-3"><strong>Measurement Unit</strong></div>
            <div className="col-sm-2"><strong>Categories</strong></div>
            <div className="col-sm-2"><strong>Action</strong></div>
            <div className="col-sm-2"><strong>Result</strong></div>
          </div>
          {biomarkers.map((biomarker, index) => (
            <div key={biomarker._id} className="row content-row">
              <div className="col-sm-1">{index + 1}</div>
              <div className="col-sm-2">{biomarker.biomarker}</div>
              <div className="col-sm-3">{biomarker.measurementUnit}</div>
              <div className="col-sm-2">{biomarker.categories}</div>
              <div className="col-sm-2 text-center eye-icon">
                <FontAwesomeIcon icon={faEye} onClick={() => handleViewTable(biomarker._id)} className="text-secondary" />
              </div>
              <div className="col-sm-2 text-center">
                <button className='btn btn-success' onClick={() => handleShowTable(biomarker._id)}>Test</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="modal show" style={{ display: 'block' }} aria-modal="true" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Biomarker</h5>
                <button type="button" className="close" onClick={handleCloseModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="biomarker">Biomarker</label>
                    <input
                      type="text"
                      className="form-control"
                      id="biomarker"
                      name="biomarker"
                      value={formData.biomarker}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="measurementUnit">Measurement Unit</label>
                    <input
                      type="text"
                      className="form-control"
                      id="measurementUnit"
                      name="measurementUnit"
                      value={formData.measurementUnit}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="categories">Categories</label>
                    <input
                      type="text"
                      className="form-control"
                      id="categories"
                      name="categories"
                      value={formData.categories}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='d-flex justify-content-end'>
                    <button type="submit" className="btn btn-primary m-2">Add Biomarker</button>
                    <button type="button" onClick={handleCloseModal} className="btn btn-danger m-2">Close</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
