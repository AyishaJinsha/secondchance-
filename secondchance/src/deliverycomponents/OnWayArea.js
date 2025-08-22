import React from 'react'
import { Col, Row, Form, Table } from 'react-bootstrap'
import MainNavbar from '../Admincomponents/MainNavbar'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './delivery.css'

const OnWayArea = () => {
    const [orders, ordfunc] = useState([])

    const timestamp = 1728196694388; // Your timestamp
    const date = new Date(timestamp);

    // Format the date to a readable string
    const formattedDate = date.toLocaleString();

    useEffect(() => {
        axios.get(`http://localhost:8080/delivery/showorder`).then(response => {
            console.log(response.data.data);
            ordfunc(response.data.data.filter(item => item.status == "On it's way"))
        })
    }, [])
    const img = 'http://localhost:8080/uploads/'

    const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));

    const changestatus = async (index, id, value) => {
        console.log(index, id, value);
        const nw = [...sortedOrders]
        if (value === "On it's way") {
            nw[index].status = value
            ordfunc(nw)
        }
        else if (value === "Delivered") {
            nw[index].status = value
            ordfunc(nw)
        }
        if (value === "confirmed") {
            nw[index].status = value
            ordfunc(nw)
        }

        await axios.post(`http://localhost:8080/delivery/changestatus`, { value, id })


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
    return (
        <>
            <Row style={{ backgroundColor: "rgb(243, 243, 243)" }} className='mt-4'>
                <Col lg={12}>
                    <center><h1 className='prod-manage-head'>Orders</h1></center>
                </Col>
            </Row>
            <Row className='justify-content-center mt-4' style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                <Col lg={12} className='table-row pt-5 ps-5 pb-5 pe-5 mb-5'>
                    <Table responsive className='user-view-table'>
                        <thead>
                            <tr>
                                <th>OrderID</th>
                                <th>Date ordered</th>
                                <th>Username</th>
                                <th>Mobile</th>
                                <th>items</th>
                                <th>Order Status</th>
                                <th>Update Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedOrders.map((i, index) => (
                                <tr key={i.id} >
                                    <td>{i.mainid}</td>
                                    <td>{i.date}</td>
                                    <td>{i.user.username}</td>
                                    <td>{i.user.mobile}</td>
                                    <td>
                                        {i.newsub.map((j) => (
                                           <div>{j.product.name}-{j.quantity}</div>
                                        ))}
                                    </td>
                                    <td ><button style={{ border: "2px solid", borderColor: getColor(i.status), borderRadius: "12px", backgroundColor: "white", color: getColor(i.status) }} className='pt-1 ps-1 pb-1 pe-1'>{i.status}</button></td>
                                    <td>
                                        <select className='custom-select' value={i.status} onChange={(e) => changestatus(index, i.mainid, e.target.value)}>
                                            <option value="confirmed">confirmed</option>
                                            <option value="On it's way">On it's way</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    )
}

export default OnWayArea