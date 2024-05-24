import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/styles.css';
import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate();

    const handleShowTable = () => {
        navigate('/about')
    }
    return (
        <div className="container mt-4">
            <div className="text-center" style={{ color: "#4f6367" }}>
                <h1>Biomarkers</h1>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="row my-3 py-3" style={{ backgroundColor: "#4f6367", color: "white", fontWeight: "300", textAlign: "center" }}>
                        <div className="col-sm-1"><strong>S.No</strong></div>
                        <div className="col-sm-2"><strong>Biomarker</strong></div>
                        <div className="col-sm-3"><strong>Measurement Unit</strong></div>
                        <div className="col-sm-2"><strong>Categories</strong></div>
                        <div className="col-sm-2"><strong>Action</strong></div>
                        <div className="col-sm-2"><strong>Result</strong></div>
                    </div>
                    <div className="row py-2" style={{ backgroundColor: "#b8d9d9", display: "flex", alignItems: "center", color: "#4f6367", fontWeight: "400", textAlign: "center" }}>
                        <div className="col-sm-1">1</div>
                        <div className="col-sm-2">Biomarker 1</div>
                        <div className="col-sm-3">Unit 1</div>
                        <div className="col-sm-2">Category 1</div>
                        <div className="col-sm-2 text-center"><FontAwesomeIcon icon={faEye} className="text-secondary" /></div>
                        <div className="col-sm-2 text-center"><button className="btn btn-success" onClick={handleShowTable}>Test</button></div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Home;