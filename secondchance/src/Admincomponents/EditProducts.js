import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Sidebar from './Sidebar'
import MainNavbar from './MainNavbar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const EditProducts = () => {

    const nav = useNavigate()
    const [pname, pres] = useState("")
    const [price, pricefn] = useState("")
    const [desc, desfn] = useState("")
    const [fl, flres] = useState("")
    const [category, catfun] = useState("")


    const editid = sessionStorage.getItem('editid')

    useEffect(() => {
        axios.get(`http://localhost:8080/admin/edit/${editid}`).then(response => {
            console.log(response.data.data);
            pres(response.data.data.name)
            pricefn(response.data.data.price)
            desfn(response.data.data.description)
            catfun(response.data.data.category)
        })
    }, [])

    const handleChange = (e) => {
        catfun(e.target.value);
    };

    const sub = async (e) => {
        e.preventDefault()
        try{
            const formData = new FormData()
            formData.append('pname', pname)
            formData.append('price', price)
            formData.append('desc', desc)
            formData.append('editid', editid)
            if (fl) {
                formData.append('fl', fl)
            }
            const response = await axios.post('http://localhost:8080/admin/postedit', formData)
            console.log(response.data.data);
            nav('/admin-products')
        }catch(err){
            console.error(err)
            alert('Failed to update product. Please try again.')
        }
    }

    return (
        <Container fluid>
            <Row>
                <Sidebar />
                <Col lg={9}>
                    <Row>
                        <MainNavbar />
                    </Row>
                    <Row style={{ backgroundColor: "rgb(243, 243, 243)" }} className='mt-4'>
                        <Col lg={12}>
                            <center><h1 className='prod-manage-head'>Edit Product Details</h1></center>
                            <Row>
                                <Col lg={8}>

                                    <div style={{ backgroundColor: "white" }} className='pb-4 mb-5 mt-3 ms-5'>
                                        <h5 className="pt-4 ms-5">Add Products</h5>
                                        <form className='ms-5' onSubmit={sub}>
                                            <label>Product Name</label><br></br>
                                            <input type="text" required placeholder='product name' className='mt-1 mb-2 pro-inputs' value={pname} onChange={(e) => pres(e.target.value)}></input><br></br>
                                            <label>Enter Price</label><br></br>
                                            <input type="number" required placeholder='price' className='mt-1 mb-2 pro-inputs' value={price} onChange={(e) => pricefn(e.target.value)}></input><br></br>
                                            <label>Category</label><br></br>
                                            <select className='pro-inputs mb-2' selected={category} value={category} onChange={handleChange}>
                                                <option value="breakfast" >Breakfast</option>
                                                <option value="lunch">Lunch</option>
                                                <option value="dinner">Dinner</option>
                                            </select><br></br>
                                            <label>Description</label><br></br>
                                            <textarea placeholder='describe' required className='mt-1 mb-2 pro-inputs' value={desc} onChange={(e) => desfn(e.target.value)}></textarea><br></br>
                                            <label>Upload Product image</label><br></br>
                                            <input type="file" placeholder='upload image' className='mt-1 mb-2 pro-inputs' onChange={(e) => flres(e.target.files[0])}></input><br></br>
                                            <button type="submit" className='mt-2 btn btn-success'>submit</button>
                                        </form>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default EditProducts