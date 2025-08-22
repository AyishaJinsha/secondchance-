import React from 'react'
import MainNav from './MainNav'
import { Container, Row, Col, Modal, Button } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import ConfirmModal from './ConfirmModal'
// import RazorPay from './RazorPay'

const Cart = () => {
    const nav = useNavigate()
    const [cart, cartres] = useState([])
    const uid = sessionStorage.getItem('uid')
    const [subtotal, subres] = useState()
    let [len, lenres] = useState()
    const [mail, mailres] = useState("")

    useEffect(() => {
        if (uid) {
            axios.get(`http://localhost:8080/user/getcart/${uid}`).then(response => {
                console.log(response.data.data);
                cartres(response.data.data)
                subres(response.data.subtotal)
                lenres(response.data.data.length)
                mailres(response.data.usermail)
            })
        }
        // else{
        //     nav('/login')
        // }


    }, [])
    const img = 'http://localhost:8080/'

    const del = async (id, total) => {
        await axios.get(`http://localhost:8080/user/cartdelete/${id}`).then(response => {
            console.log(response.data.data);
            cartres(cart.filter(item => item._id !== id))
            let newtot = subtotal - total
            subres(newtot)
            let newlen = len - 1
            lenres(newlen)
        })
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const checkout = (e) => {
        e.preventDefault()
        if (cart == "") {
            alert("please add item to cart")
        }
        else {
            handleShow()
        }
    }

    const [cardname, nres] = useState("")
    const [cardnum, cres] = useState()
    const [exdate, dres] = useState("")
    const [cvv, cvvres] = useState()

    return (
        <>
            <Container fluid>
                <Row>
                    <MainNav />
                </Row>
            </Container>
            {uid ?

                <Container fluid >
                    <Row style={{ backgroundColor: "rgb(247, 245, 243)" }} className='ms-5 me-5'>
                        <Row className='mt-3'>
                            <center>
                                <Col lg={6}>
                                    <h1 className='edu-au-vic-wa-nt-hand-intro mt-5'>Food Cart</h1>
                                </Col>
                            </center>
                        </Row>
                        <Row className='ms-2 pb-4 mt-5'>
                            <Col lg={7} md={10} sm={10} xs={10}>
                                <Link to='/recipes' style={{ textDecoration: "none", color: "black" }}><div style={{ fontWeight: "600" }} className='mt-3'> ← Continue Shopping</div></Link>
                                <hr></hr>
                                <div style={{ fontWeight: "500" }}>Shopping Cart</div>
                                <div style={{ fontWeight: "300" }}>You have {len} items in your cart</div>
                                {cart.map((i) => (
                                    <Row>
                                        <Col lg={12} className='d-flex mt-3 cart-col'>
                                            <img src={`${img}${i.product.image}`} className='pt-2' height="120px" width="120px"></img>
                                            <h4 className='belleza-regular cart-item-name'>{i.product.name}</h4>
                                            <div className='cart-qt belleza-regular'>Qty : {i.quantity}</div>
                                            <div className='cart-total belleza-regular'>₹ {i.total}</div>
                                            <RiDeleteBin6Line className='cart-delete' onClick={() => del(i._id, i.total)} />
                                        </Col>
                                    </Row>
                                ))}
                            </Col>
                            <Col lg={4} md={10} sm={10} xs={10} className='payment-col'>
                                <h5 className='payment-head belleza-regular mt-3 ms-2'>Card Details</h5>
                                <label className='payment-label mt-4'>Card type</label><br></br>
                                <div className='mt-2'>
                                    <img src="./rupay.webp" height="50px" width="60px" className='card-style ms-2 ps-1'></img>
                                    <img src="./mastercard.png" height="50px" width="60px" className='card-style ms-4 ps-1 pe-1'></img>
                                    <img src="./visa.png" height="50px" width="60px" className='card-style ms-4 pe-1'></img>
                                </div>


                                <form className='mt-4'>
                                    <label className='payment-label'>Name on card</label><br></br>
                                    <input type="text" placeholder='name' required className='form-control mt-1 payment-form' onChange={(e) => nres(e.target.value)}></input><br></br>
                                    <label className='payment-label'>Card number</label><br></br>
                                    <input type="Number" required placeholder='1111 2222 3333 4444' className='form-control mt-1 payment-form' onChange={(e) => cres(e.target.value)} ></input><br></br>
                                    <Row>
                                        <Col lg={5}>
                                            <label className='payment-label'>expiration date</label><br></br>
                                            <input type="date" required className='form-control mt-1 payment-form' onChange={(e) => dres(e.target.value)}></input>
                                        </Col>
                                        <Col lg={5}>
                                            <label className='payment-label'>cvv</label><br></br>
                                            <input type="number" required placeholder='123' className='form-control mt-1 payment-form' onChange={(e) => cvvres(e.target.value)}></input><br></br>
                                        </Col>
                                    </Row>
                                    <hr></hr>
                                    <div className='payment-label'>
                                        <div>subtotal</div><div className='text-end subtotal'>₹ {subtotal}</div>
                                    </div>
                                    <button className='chk-out-btn mt-4 pt-3 pb-3' onClick={checkout}>checkout ➡️</button>
                                    <ConfirmModal show={show} handleClose={handleClose} cardname={cardname} cardnum={cardnum} mail={mail} subtotal={subtotal} uid={uid} />
                                </form>
                            </Col>
                        </Row>

                    </Row>

                </Container>

                :
                <center>
                    <h1 className='edu-au-vic-wa-nt-hand-intro mt-5'>Please Login to View Cart items</h1>
                    <button onClick={() => nav('/login')} className='newlogin edu-au-vic-wa-nt-hand-intro'>Log in</button>
                </center>}


        </>
    )
}

export default Cart