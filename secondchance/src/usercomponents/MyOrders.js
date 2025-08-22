import React from 'react'
import { Container, Row, Col, Table } from 'react-bootstrap'
import MainNav from './MainNav'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './home.css'



const MyOrders = () => {
    const nav = useNavigate()
    const uid = sessionStorage.getItem('uid')
    const [order, orderfunc] = useState([])


    useEffect(() => {
        let index = 0
        if (uid) {
            axios.get(`http://localhost:8080/user/getorder/${uid}/${index}`).then(response => {
                console.log(response.data.data);
                orderfunc(response.data.data)
            })
        }

    }, [])
    const img = 'http://localhost:8080/uploads/'

    const [activeIndex, setActiveIndex] = useState(0);

    const handleButtonClick = (index) => {
        setActiveIndex(index);
        if (uid) {
            axios.get(`http://localhost:8080/user/getorder/${uid}/${index}`).then(response => {
                console.log(response.data.data);
                orderfunc(response.data.data)
            })
        }
    };

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

    const sortedOrders = [...order].sort((a, b) => new Date(b.date) - new Date(a.date));


    return (
        <>
            <Container fluid>
                <Row>
                    <MainNav />
                </Row>
            </Container>
            {uid ?

                <Container fluid className='ms-5'>
                    <Row className='mt-3'>
                        <Col lg={12}>
                            <div id="myDIV">
                                {["all orders", "pending", "confirmed", "Delivered", "on it's way"].map((num, index) => (
                                    <button
                                        key={num}
                                        className={`order-nav me-3 pt-2 pb-2 ps-3 pe-3 ${activeIndex === index ? 'active' : ''}`}
                                        onClick={() => handleButtonClick(index)}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </Col>
                    </Row>
                    {sortedOrders.map((i) => (
                        <Row className='mt-4'>


                            <Col lg={8} style={{ backgroundColor: "rgb(247, 245, 243)", borderRadius: "8px" }}>
                                <div className=' mb-5 ms-5 me-5 mt-4'>
                                    <div className='d-flex mt-2 head-div'><div>Order ID: {i.mainid}</div><div style={{ color: getColor(i.status) }}>.{i.status}</div></div><div className='text-end head-div ord-subtotal'>subtotal</div>
                                    <div>{i.date}</div>
                                    <hr></hr>
                                    <Table striped hover className='table-whole'>
                                        <thead>
                                            <tr style={{ backgroundColor: "black" }}>
                                                <th className='t-heads'>Product</th>
                                                <th className='t-heads'>Price per unit</th>
                                                <th className='t-heads'>Qty</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {i.newsub.map((j) => (
                                                <tr>
                                                    <td className='d-flex'><img src={`${img}${j.product.image}`} height="50px" width="50px" style={{ borderRadius: "100%" }} className='me-3'></img><div className='t-pro-name mt-2'>{j.product.name}</div></td>
                                                    <td><div className='mt-2 t-pro-name'>{j.product.price}</div></td>
                                                    <td><div className='mt-1 t-pro-name'>{j.quantity}</div></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>

                                </div>
                            </Col>

                        </Row>
                    ))}
                </Container>

                :
                <center>
                    <h1 className='edu-au-vic-wa-nt-hand-intro mt-5'>Please Login to View Your Orders</h1>
                    <button onClick={() => nav('/login')} className='newlogin edu-au-vic-wa-nt-hand-intro'>Log in</button>
                </center>}

        </>
    )
}

export default MyOrders