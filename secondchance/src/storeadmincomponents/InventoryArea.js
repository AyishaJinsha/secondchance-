import React from 'react'
import { Col, Row, Table, Modal, Container } from 'react-bootstrap'
import MainNavbar from '../Admincomponents/MainNavbar'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './storeadmin.css'


const InventoryArea = () => {

    const [pro, prores] = useState([])
    useEffect(() => {
        axios.get(`http://localhost:8080/storeadmin/getproduct`).then(response => {
            console.log(response.data.data);
            prores(response.data.data)
        })
    }, [])
    const img = 'http://localhost:8080/uploads/'

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [specpro, specres] = useState([])
    const prospec = async (id) => {
        handleShow()
        axios.get(`http://localhost:8080/user/prospec/${id}`).then(response => {
            console.log(response.data.data);
            specres(response.data.data)
        })
    }
    const [newstock, newstockfunc] = useState()


    const stocksub = async (e) => {
        let newid=specpro._id
        e.preventDefault()
        const response = await axios.post(`http://localhost:8080/storeadmin/stockpost`, { newstock,newid })
        console.log(response.data.data);
        handleClose()
        window.location.reload()
    }

    return (
        <>
            
                <Row style={{ backgroundColor: "rgb(243, 243, 243)" }} className='mt-4'>
                    <Col lg={12}>
                        <center><h1 className='prod-manage-head'>Inventory</h1></center>
                    </Col>
                </Row>
                <Row className='justify-content-center mt-4 ' style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                    <Col lg={10} className='table-row pt-5 ps-5 pb-5 pe-5 mb-5'>
                        <Table responsive className='user-view-table'>
                            <thead>
                                <tr>
                                    <th>product</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Availabe stock</th>
                                    <th>Add Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pro.map((i, index) => (
                                    <tr key={i.id} >
                                        {/* <td>{index + 1}</td> */}
                                        <td><img src={`${img}${i.image}`} height="80px" width="80px"></img></td>
                                        <td><div className='mt-3'>{i.name}</div></td>
                                        <td><div className='mt-3'>₹{i.price}</div></td>
                                        <td><div className='mt-3 ms-3'>{i.stock}</div></td>
                                        <td><div className='mt-3'><button className='stock-btn ps-3 pe-3 pt-1 pb-1' onClick={() => prospec(i._id)}>Add Stock</button></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            <Modal show={show} onHide={handleClose} className='mt-5'>
                <Container fluid>
                    <Row>
                        <Col lg={7}>
                            <img src={`${img}${specpro.image}`} height="250px" width="230px"></img>
                        </Col>
                        <Col lg={5}>
                            <div className='d-flex mt-3'>
                                <div className='current-stock'>Current Stock</div>
                                <div className='current-stock-am ms-3'>{specpro.stock}</div>
                            </div>

                            <form className='mt-4' onSubmit={stocksub}>
                                <label>Enter new Stock</label>
                                <input type='Number' className='mt-1 mb-2 pro-inputs' onChange={(e)=>newstockfunc(e.target.value)}></input><br></br>
                                <button type="submit" className='mt-2 btn btn-success'>submit</button>
                            </form>
                        </Col>
                    </Row>
                </Container>
            </Modal>
        </>
    )
}

export default InventoryArea