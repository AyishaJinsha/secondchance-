import React from 'react'
import { Col, Row, Container, Table, Form, Modal } from 'react-bootstrap'
import MainNavbar from '../Admincomponents/MainNavbar'
import { useState, useEffect } from 'react'
import axios from 'axios'

const OrderArea = () => {

    const [orders, ordfunc] = useState([])

    // const [checkvalue,func]=useState("")
    // console.log(checkvalue);

    useEffect(() => {
        axios.get(`http://localhost:8080/storeadmin/storegetorder`).then(response => {
            console.log(response.data.data);
            ordfunc(response.data.data)
        })
    }, [])
    const img = 'http://localhost:8080/uploads/'

    const changestatus = async (index, id) => {
        // console.log(index, id);
        const nw = [...orders]
        if (nw[index].status === "pending") {
            let newstatus = "confirmed"
            nw[index].status = "confirmed"
            ordfunc(nw)
            await axios.post(`http://localhost:8080/storeadmin/confirmpost`, { newstatus, id })
        }
        else {
            let newstatus = "pending"
            nw[index].status = "pending"
            ordfunc(nw)
            await axios.post(`http://localhost:8080/storeadmin/confirmpost`, { newstatus, id })
        }
        console.log(orders);


    }

    const getColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'green';
            case 'pending':
                return 'red';
            case "On it's way":
                return 'orange';
            case "confirmed":
                return 'blue';
        }
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);





    return (
        <>

            <Row style={{ backgroundColor: "rgb(243, 243, 243)" }} className='mt-4'>
                <Col lg={12}>
                    <center><h1 className='prod-manage-head'>Orders</h1></center>
                </Col>
            </Row>
            <Row className='justify-content-center mt-4' style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                <Col lg={10} className='table-row pt-5 ps-5 pb-5 pe-5 mb-5'>
                    <Table responsive className='user-view-table'>
                        <thead>
                            <tr>
                                <th>OrderID</th>
                                <th>Username</th>
                                {/* <th>items</th> */}
                                <th>items & Quantity</th>
                                <th>Order Status</th>
                                <th>Confirm Order</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((i, index) => (
                                <tr key={i.id} >
                                    <td>{i.mainid}</td>
                                    <td>{i.user.username}</td>
                                    <td>
                                        {i.newsub.map((j) => (
                                           <div>{j.product.name}-{j.quantity}</div>
                                        ))}
                                    </td>

                                    <td><button style={{ border: "2px solid", borderColor: getColor(i.status), borderRadius: "12px", backgroundColor: "white", color: getColor(i.status) }} className='pt-1 ps-2 pb-1 pe-2'>{i.status}</button></td>
                                    <td>
                                        {(i.status === "pending" || i.status === "confirmed") ?
                                            <Form className='ms-4'>
                                                {['checkbox'].map((type) => (
                                                    <div key={type} className="mb-3">
                                                        <Form.Check type={type} id={`check-api-${type}`} >
                                                            <Form.Check.Input type={type} value={i.status} checked={i.status === "confirmed"} onChange={() => changestatus(index, i.mainid)} isValid />
                                                            {/* <Form.Check.Label>Check to Confirm</Form.Check.Label> */}
                                                        </Form.Check>
                                                    </div>
                                                ))}
                                            </Form>
                                            : <h1></h1>
                                        }
                                    </td>

                                    <td></td>
                                </tr>

                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

        </>
    )
}

export default OrderArea