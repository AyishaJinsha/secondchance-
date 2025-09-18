import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import StoreSidebar from './StoreSidebar'
import OrderArea from './OrderArea'
import { useState } from 'react'
import MainNavbar from '../Admincomponents/MainNavbar'
import PaymentArea from './PaymentArea'


const PaymentHome = () => {
    const [sidevisible, hideside] = useState(true)

    const changevisibility = () => {
        hideside(!sidevisible)
    }
    return (
        <>
            <div style={{ height: "100vh", backgroundColor: "rgb(243, 243, 243)" }}>
                <Container fluid>
                    <Row>
                        <StoreSidebar sidevisible={sidevisible} />
                        <Col lg={sidevisible ? 9 : 12}>
                            <Row style={{ backgroundColor: "white", height: "90px" }}>
                                <MainNavbar changevisibility={changevisibility} sidevisible={sidevisible} />
                            </Row>
                            <PaymentArea />
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default PaymentHome