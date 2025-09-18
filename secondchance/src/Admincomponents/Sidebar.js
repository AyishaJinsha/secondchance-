import React from 'react'
import { Col, Row, Nav, Navbar } from 'react-bootstrap'
import './admin.css'
import { Link } from 'react-router-dom'

const Sidebar = ({ sidevisible }) => {
    const aid=sessionStorage.getItem('aid')
    return (
        <>
            <Col lg={sidevisible ? 3 : 0} className={sidevisible ? '' : 'd-none'}>
                <Nav defaultActiveKey="/home" className="flex-column sidebar-col" style={{ position: "fixed" }}>
                    <Row className="side-row-head">
                        <Col lg={12} >
                            <div className='admin-name pt-4 ps-4 pb-4'>{aid}</div>
                        </Col>
                        <Col lg={12}>
                            <div className='main-menu-text pt-4 ps-5'>Main Menu</div>
                            <hr style={{ color: "white" }}></hr>
                        </Col>
                    </Row>
                    <div className='dropdown'><Nav.Link className='main-menu-items'><Link to='/admin-product-manage' style={{ textDecoration: "none", color: "white" }}>Product Management</Link></Nav.Link>
                        <div class="dropdown-content mb-5">
                            <Link to='/admin-product-manage' style={{ textDecoration: "none" }}><a className='nav-items-links'>Add products</a></Link>
                            <Link to='/admin-products' style={{ textDecoration: "none" }}><a className='nav-items-links'>products</a></Link>
                        </div>
                    </div>
                    <Nav.Link className='main-menu-items'><Link to='/admin-user-manage' style={{ textDecoration: "none", color: "white" }}>User Management</Link></Nav.Link>
                    <Nav.Link className='main-menu-items' > <Link to='/sales-analysis' style={{ textDecoration: "none", color: "white" }}>Sales Analysis</Link> </Nav.Link> 
                    <div className='dropdown'>
                        <Nav.Link className='main-menu-items' > <Link to='/marketing-manage' style={{ textDecoration: "none", color: "white" }}>Staff Management </Link></Nav.Link>
                        <div class="dropdown-content mb-5">
                        <Link to='/view-staff' style={{ textDecoration: "none" }}><a className='nav-items-links'>view Staffs</a></Link>
                            <Link to='/marketing-manage' style={{ textDecoration: "none" }}><a className='nav-items-links'>Create Store Admin</a></Link>
                            <Link to='/create-del-staff' style={{ textDecoration: "none" }}><a className='nav-items-links'>Create delivery staff</a></Link>
                        </div>
                    </div> 
                     <Nav.Link className='main-menu-items' ><Link to='/revenue-tracking' style={{ textDecoration: "none", color: "white" }}> Revenue tracking </Link></Nav.Link> 
                </Nav>
            </Col>
        </>
    )
}

export default Sidebar