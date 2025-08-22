import React from 'react'
import { Col, Row, Container, Table, Form } from 'react-bootstrap'
import MainNavbar from '../Admincomponents/MainNavbar'
import { useState, useEffect } from 'react'
import axios from 'axios'


const PaymentArea = () => {
    const [orders, ordfunc] = useState([])
    const [alltotal,alltotres]=useState()

    // const [checkvalue,func]=useState("")
    // console.log(checkvalue);

    useEffect(() => {
        axios.get(`http://localhost:8080/storeadmin/storegetorder`).then(response => {
            console.log(response.data.data);
            ordfunc(response.data.data)
            alltotres(response.data.subtotal)
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
    return (
        <>
            <Row style={{ backgroundColor: "rgb(243, 243, 243)" }} className='mt-4'>
                <Col lg={12}>
                    <center><h1 className='prod-manage-head'>Payments</h1></center>
                </Col>
            </Row>
            <Row className='justify-content-center mt-4' style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                <Col lg={10} className='table-row pt-5 ps-5 pb-5 pe-5 mb-5'>
                    <Table responsive className='user-view-table'>
                        <thead>
                            <tr>
                                <th>OrderID</th>
                                <th>Username</th>
                                <th>items</th>
                                <th>Payment Recieved</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((i, index) => (
                                <tr key={i.id} >
                                    <td>{i.mainid}</td>
                                    <td>{i.user.username}</td>
                                    <td>{i.newsub.length} items</td>
                                    <td>₹{i.subtotal}</td>
                                    <td></td>
                                </tr>
                            ))}
                            <tr >
                                <td></td>
                                <td></td>
                                <td>Total</td>
                                <td>₹{alltotal}</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    )
}

export default PaymentArea