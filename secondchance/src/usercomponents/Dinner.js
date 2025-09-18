import React from 'react'
import { Container, Row, Col,Card } from 'react-bootstrap'
import { useState,useEffect } from 'react'

import MainNav from './MainNav'
import Foods from './Foods'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AddCartModal from './AddCartModal'
import FooterAll from './FooterAll'


const Dinner = () => {
    const nav = useNavigate()
    const [pro, prores] = useState([])



    useEffect(() => {
        axios.get(`http://localhost:8080/user/getproduct`).then(response => {
            console.log(response.data.data);
            prores(response.data.data.filter(item=>item.category=="dinner" || item.category=="all"))
        })

    }, [])
    const img = 'http://localhost:8080/'



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
    const [qty, qtres] = useState(1)

    const addqt = () => {
        const newqt = qty + 1
        qtres(newqt)
    }
    const subqt = () => {
        if (qty > 1) {
            const newqt = qty - 1
            qtres(newqt)
        }
        else {
            alert("Quantity can't be 0")
        }
    }

    const closepro = () => {
        qtres(1)
        handleClose()
    }
    const uid = sessionStorage.getItem('uid')

    const addcart = async (id) => {
        if (qty == "" || qty < 0) {
            alert("enter a valid number")
        }
        else {
            if (uid) {
                const response = await axios.post('http://localhost:8080/user/addcart', { id, uid, qty })
                console.log(response.data.data);
                if (response.data.data == "no stock") {
                    alert(" sorry item out of stock")
                }
                else if (response.data.data == "ok") {
                    nav('/cart')
                }
            }
            else {
                alert("please login to add item to cart")
            }


        }

    }

    return (
        <>
            <Container fluid>
                <Row>
                    <MainNav />
                </Row>
            </Container>
            <Container fluid >
                <Row style={{ backgroundColor: "rgb(247, 245, 243)" }} className='ms-5 me-5'>
                    <Row className='mt-3'>
                        <center>
                            <Col lg={6}>
                                <h1 className='edu-au-vic-wa-nt-hand-intro mt-5'>Dinner.</h1>
                            </Col>
                        </center>
                    </Row>
                    <Row className='justify-content-center'>
                        {pro.map((i) => (
                            <Col lg={3} style={{ marginTop: "80px", marginBottom: "80px" }}>
                                <Card style={{ width: '18rem' }} className='food-card'>
                                    <Card.Img variant="top" className='food-card-image' src={`${img}${i.image}`} height="230px" width="10px" />
                                    <Card.Body>
                                        <Card.Title className='text-center'>{i.name}</Card.Title>
                                        <hr></hr>
                                        <button className='top-coll-btn ms-3' onClick={() => prospec(i._id)}>Order</button>
                                        <div className='price-style text-end' style={{ marginTop: "-35px" }}>₹{i.price}</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                        <AddCartModal show={show} closepro={closepro} img={img} specpro={specpro} addcart={addcart} addqt={addqt} qty={qty} qtres={qtres} subqt={subqt} />

                    </Row>
                </Row>
            </Container>
            <Container fluid className='footer-container'>
                <Row>
                    <FooterAll />
                </Row>
            </Container>
        </>
    )
}

export default Dinner