import React from 'react'
import { Modal, Button, Container, Row, Col } from 'react-bootstrap'
import './register.css'
import { useState } from 'react'
import Login from './Login'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const SignUp = ({ showsign, CloseSign }) => {
    const nav = useNavigate()
    const [uname, nres] = useState("")
    const [email, mailres] = useState("")
    const [pass, pres] = useState("")
    const [mobile, numres] = useState()

    const sub = async (e) => {
        e.preventDefault()
        if (!/^\d{10}$/.test(String(mobile || ''))) {
            alert('Mobile number must be exactly 10 digits')
            return
        }
        const response = await axios.post('http://localhost:8080/user/signup', { uname, email, pass, mobile })
        if (response.data.data == "exist") {
            alert("email already exist")
        }
        else {
            console.log(response.data.data);
            // CloseSign()
            nav('/')
            sessionStorage.setItem('uid', response.data.uid)
        }
  }
    const gotologin = () => {
        nav('/login')
    }

    return (
        <>
            <Modal show className='mt-5'>
                <Container fluid>
                    <Row className='justify-content-center mt-3'>
                        <Col lg={7} className='ms-3'>
                            <h3>Create an Account</h3>
                        </Col>
                    </Row>
                    <Row className='justify-content-center'>
                        <Col lg={8} className='ps-4'>
                            Introduce your information to Register
                        </Col>
                    </Row>
                    <Row className='justify-content-center mt-4'>
                        <Col lg={9}>
                            <form onSubmit={sub}>
                                <input type='email' placeholder='enter email id' className='input-areas pt-1 pb-1' onChange={(e) => mailres(e.target.value)}></input><br></br>
                                <input type='password' placeholder='enter your password' className='mt-2 input-areas pt-1 pb-1' onChange={(e) => pres(e.target.value)}
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" required></input><br></br>
                                <input type='text' placeholder='enter your username' className='mt-2 input-areas pt-1 pb-1' onChange={(e) => nres(e.target.value)}></input><br></br>
                                <input type='number' min="1000000000" max="9999999999" placeholder='enter your mobile number' className='mt-2 input-areas pt-1 pb-1' onChange={(e) => numres(e.target.value)}></input><br></br>
                                <center>
                                    <button type='submit' className='mt-4 sg-btn pt-1 pb-1 mb-2'>Sign up</button>
                                    <div className='mb-5' style={{ cursor: "pointer" }}>Already Have an account? <u style={{ color: "rgb(249, 68, 23)" }} onClick={gotologin}>Login Now</u></div>
                                </center>
                            </form>
                        </Col>
                    </Row>
                </Container>
            </Modal>
        </>
    )
}

export default SignUp