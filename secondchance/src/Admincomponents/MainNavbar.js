import React, { useState } from 'react'
import { Col, Row, Navbar, Nav, Container, Form } from 'react-bootstrap'
import { IoMenuOutline } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa";
import { MdOutlineForwardToInbox } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const MainNavbar = ({ changevisibility, sidevisible }) => {
    const nav = useNavigate()

    const logout = () => {
        sessionStorage.setItem('aid', '')
        sessionStorage.setItem('did', '')
        sessionStorage.setItem('said', '')
        nav('/admin')
    }

    return (
        <>
            <Col lg={12} className='pt-4'>

                <Row>
                    <Navbar collapseOnSelect expand="lg" className="" style={{ backgroundColor: "white" }}>
                        <Container fluid>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                            <Navbar.Collapse id="responsive-navbar-nav">
                                <Nav className="me-auto">
                                    {/* <Nav.Link className='options help ms-5 mt-1' onClick={changevisibility}>Navigation bar</Nav.Link> */}
                                    <Nav.Link ><IoMenuOutline style={{ fontSize: "40px", cursor: "pointer" }} className='ms-3 outline-logo' onClick={changevisibility} /></Nav.Link>
                                    <Nav.Link><div className='help ms-5 mt-1'>Help: +91 6235548686</div></Nav.Link>
                                    {/* <Nav.Link><input type="search" placeholder='Search' className='form-control'  style={{ width: "400px" }}></input></Nav.Link> */}
                                    <center><Navbar.Brand className='lobster-regular ms-5' style={{ fontSize: "28px" }}>2ndchancefoods</Navbar.Brand></center>
                                </Nav>
                                <Nav>
                                    {/* <Nav.Link><FaRegBell style={{ fontSize: "25px" }} className='ms-5 mt-1 mb-2' /> */}
                                    {/* </Nav.Link> */}
                                    <Nav.Link><MdLogout style={{ fontSize: "25px", cursor: "pointer" }} className='ms-5 mt-1 mb-2' onClick={logout} />
                                    </Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </Row>
            </Col>

            {/* <Col lg={1} md={3} sm={8} xs={8}>
                            <IoMenuOutline style={{ fontSize: "40px", cursor: "pointer" }} className='ms-3' onClick={changevisibility} />
                        </Col>
                        <Col lg={4} md={3} sm={8} xs={8}>
                            <div className='help ms-5 mt-1'>Help: +91 6235548686</div>
                        </Col>
                        <Col lg={5} md={3} sm={8} xs={8}>
                            <div className='ms-5'><input type="search" placeholder='Search' className='form-control' style={{ width: "400px" }}></input></div>
                        </Col>
                        <Col lg={1} md={3} sm={8} xs={8}>
                            <FaRegBell style={{ fontSize: "25px" }} className='ms-5 mt-1' />
                        </Col>
                        <Col lg={1} md={3} sm={8} xs={8}>
                        <MdLogout style={{ fontSize: "25px",cursor:"pointer" }} className='ms-5 mt-1' onClick={logout}/>
                        </Col> */}
        </>
    )
}

export default MainNavbar