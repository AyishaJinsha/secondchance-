import React from 'react'
import { Col, Row } from 'react-bootstrap'
import MainNavbar from './MainNavbar'
import { useEffect,useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const MarketingManageArea = () => {
    const nav=useNavigate()

    const [uname,ures]=useState("")
    const [pass,passres]=useState()
    const [mob,mobres]=useState()

    const sub=async(e)=>{
        e.preventDefault()
        if(!/^\d{10}$/.test(String(mob||''))){
            alert('Mobile number must be exactly 10 digits')
            return
        }
        const response=await axios.post('http://localhost:8080/admin/createstore',{uname,pass,mob})
        console.log(response.data.data);
        if(response.data.data=="exist"){
            alert("username already exist")
        }
        else{
            console.log("rrrrrrr");       
            nav('/view-staff')
        }       
    }



    return (
        <>
            <Row style={{ backgroundColor: "rgb(243, 243, 243)" }} className='mt-4'>
                <Col lg={12}>
                    <center><h1 className='prod-manage-head'>Staff Management</h1></center>
                </Col>
                <Row>
                    <Col lg={8}>
                        <div style={{ backgroundColor: "white" }} className='pb-4 mb-5 mt-3 ms-5'>
                            <h5 className="pt-4 ms-5">Create Store Admin</h5>
                            <form className='ms-5' onSubmit={sub}>
                                <label>username</label><br></br>
                                <input type="text" required placeholder='username' className='mt-1 mb-2 pro-inputs' onChange={(e)=>ures(e.target.value)}></input><br></br>
                                <label>Password</label><br></br>
                                <input type="password" required placeholder='password' className='mt-1 mb-2 pro-inputs' onChange={(e)=>passres(e.target.value)}></input><br></br>
                                <label>mobile number</label><br></br>
                                <input type="number" required min="1000000000" max="9999999999" placeholder='mobile' className='mt-1 mb-2 pro-inputs' onChange={(e)=>mobres(e.target.value)}></input><br></br>
                                <button type="submit" className='mt-2 btn btn-success'>create</button>
                            </form>
                        </div>
                    </Col>
                </Row>
            </Row>
        </>
    )
}

export default MarketingManageArea