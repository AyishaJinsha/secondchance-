import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import axios from 'axios'
import Sidebar from './Sidebar'
import MainNavbar from './MainNavbar'
import { useNavigate } from 'react-router-dom'

const ProductList = () => {
    const nav = useNavigate()
    const [pro, prores] = useState([])

    useEffect(()=>{
        if(sessionStorage.getItem('aid')==''){
            nav('/admin')
        }
    })

    useEffect(() => {
        axios.get(`http://localhost:8080/user/getproduct`).then(response => {
            console.log(response.data.data);
            prores(response.data.data)
        })
    }, [])
    const img = 'http://localhost:8080/'

    const editpage = (e) => {
        sessionStorage.setItem('editid', e)
        nav('/edit')
    }

    const del = async (id) => {
        console.log("deeellll" + id);
        const response = await axios.post(`http://localhost:8080/admin/delete`, { id })
        console.log(response.data.data);
        prores(pro.filter(item => item._id !== id))
        

    }
    const [sidevisible,hideside]=useState(true)

    const changevisibility=()=>{
        hideside(!sidevisible)
    }

    return (
        <>  <Container fluid>
            <Row>
                <Sidebar sidevisible={sidevisible} />
                <Col lg={sidevisible ? 9 : 12}>
                    <Row style={{backgroundColor: "white",height:"90px" }}>
                        <MainNavbar changevisibility={changevisibility} sidevisible={sidevisible} />
                    </Row>
                    <Row style={{ backgroundColor: "rgb(243, 243, 243)" }} className='mt-4'>
                        <Col lg={12}>
                            <center><h1 className='prod-manage-head'>Products</h1></center>
                            <Container fluid className='carousel-container'>
                                <Row className='mt-5'>
                                    {pro.map((i) => (
                                        <Col lg={sidevisible ? 4 : 3} style={{ marginTop: "80px", marginBottom: "80px" }}>
                                            <Card style={{ width: '18rem' }} className='food-card'>
                                                <Card.Img variant="top" className='food-card-image' src={`${img}${i.image.replace(/\\/g, '/')}`} height="230px" width="10px" />
                                                <Card.Body>
                                                    <Card.Title className='text-center'>{i.name}</Card.Title>
                                                    <hr></hr>
                                                    <button className='top-coll-btn ms-3' style={{ backgroundColor: "rgb(28, 69, 239)" }} onClick={() => editpage(i._id)}>Edit</button>
                                                    <button className='top-coll-btn text-end' style={{ backgroundColor: "rgb(28, 69, 239)", marginLeft: "100px" }} onClick={() => del(i._id)}>Delete</button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
        </>
    )
}

export default ProductList