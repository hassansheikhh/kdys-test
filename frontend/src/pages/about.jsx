import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'


function About() {
    const navigate = useNavigate();

    const handleShowTable = () => {
        navigate('/')
    }

    return (
        <div className="container mt-4" style={{ position: "relative" }}>
            <div className="postion-absolute" style={{ color: "#4f6367", top:"10px", position: "absolute", alignItems: 'center', cursor: "pointer" }} onClick={handleShowTable}>
                <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '10px' }} />
                    <span style={{fontWeight:"700"}}>Back</span>
            </div>
            <div style={{ color: "#4f6367" }} className='d-flex justify-content-center'>
                <div className="d-flex align-item-center text-center">
                    <h1 style={{fontWeight:"600"}}>Biomarkers</h1>
                </div>
            </div>
            <div className="container" style={{ backgroundColor: "#b8d9d9", borderRadius: "10px" }}>
                <div className="p-4">
                    <div>
                        <label htmlFor="" className="my-2" style={{ fontWeight: 500 }} >Name:</label>
                        <p>SHIB</p>
                    </div>
                    <div>
                        <label htmlFor="" className="my-2" style={{ fontWeight: 500 }}>Measurement:</label>
                        <p>SHIB</p>
                    </div>
                    <div>
                        <label htmlFor="" className="my-2" style={{ fontWeight: 500 }}>Description:</label>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse quasi, molestias non molestiae id ducimus!
                         Iure recusandae tempore veritatis, ipsam asperiores fuga corporis error soluta impedit animi possimus porro illum.</p>
                    </div>
                    <div>
                        <label htmlFor="" className="my-2" style={{ fontWeight: 500 }}>Methods of Decrease:</label>
                        <p>weight loss and exercise</p>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="row my-3 py-3" style={{ backgroundColor: "#4f6367", color: "white", fontWeight: "300", textAlign: "center", borderRadius: "10px" }}>
                                <div className="col-sm-1"><strong>Group</strong></div>
                                <div className="col-sm-2"><strong>Age</strong></div>
                                <div className="col-sm-3"><strong>Reference Low</strong></div>
                                <div className="col-sm-2"><strong>Reference High</strong></div>
                                <div className="col-sm-2"><strong>Optional Low</strong></div>
                                <div className="col-sm-2"><strong>Optional High</strong></div>
                            </div>
                            <div className="row py-3 my-3" style={{ backgroundColor: "white", display: "flex", alignItems: "center", color: "#4f6367", fontWeight: "400", textAlign: "center", borderRadius: "10px" }}>
                                <div className="col-sm-1">1</div>
                                <div className="col-sm-2">Biomarker 1</div>
                                <div className="col-sm-3">Unit 1</div>
                                <div className="col-sm-2">Category 1</div>
                                <div className="col-sm-2">Unit 1</div>
                                <div className="col-sm-2">Category 1</div>
                            </div>
                            <div className="row py-3 my-3" style={{ backgroundColor: "white", display: "flex", alignItems: "center", color: "#4f6367", fontWeight: "400", textAlign: "center", borderRadius: "10px" }}>
                                <div className="col-sm-1">1</div>
                                <div className="col-sm-2">Biomarker 1</div>
                                <div className="col-sm-3">Unit 1</div>
                                <div className="col-sm-2">Category 1</div>
                                <div className="col-sm-2">Unit 1</div>
                                <div className="col-sm-2">Category 1</div>
                            </div>
                            <div className="row py-3 my-3" style={{ backgroundColor: "white", display: "flex", alignItems: "center", color: "#4f6367", fontWeight: "400", textAlign: "center", borderRadius: "10px" }}>
                                <div className="col-sm-1">1</div>
                                <div className="col-sm-2">Biomarker 1</div>
                                <div className="col-sm-3">Unit 1</div>
                                <div className="col-sm-2">Category 1</div>
                                <div className="col-sm-2">Unit 1</div>
                                <div className="col-sm-2">Category 1</div>
                            </div>
                            <div className="row py-3" style={{ backgroundColor: "white", display: "flex", alignItems: "center", color: "#4f6367", fontWeight: "400", textAlign: "center", borderRadius: "10px" }}>
                                <div className="col-sm-1">1</div>
                                <div className="col-sm-2">Biomarker 1</div>
                                <div className="col-sm-3">Unit 1</div>
                                <div className="col-sm-2">Category 1</div>
                                <div className="col-sm-2">Unit 1</div>
                                <div className="col-sm-2">Category 1</div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default About;