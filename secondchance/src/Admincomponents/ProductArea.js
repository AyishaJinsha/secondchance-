import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const ProductArea = ({sidevisible}) => {
    const [pname, pres] = useState("")
    const [price, pricefn] = useState("")
    const [desc, desfn] = useState("")
    const [fl, flres] = useState("")
    const [category, catfun] = useState("")

    const nav = useNavigate()

    const sub = async (e) => {
        e.preventDefault()
        if (Number(price) <= 0) {
            alert('Price must be greater than 0')
            return
        }
        try{
            const formData = new FormData()
            formData.append('pname', pname)
            formData.append('price', price)
            formData.append('desc', desc)
            formData.append('category', category)
            if (fl) {
                formData.append('fl', fl)
            }
            const response = await axios.post('http://localhost:8080/admin/productpost', formData)
            console.log(fl);
            console.log(response.data.data);
            nav('/admin-products')
        }catch(err){
            console.error(err)
            alert('Failed to create product. Please try again.')
        }
    }

    const handleChange = (e) => {
        catfun(e.target.value);
    };

    return (
        <>
            {/* <Col lg={9}>
                <Row style={{backgroundColor: "white",height:"90px" }}>
                    <MainNavbar />
                </Row> */}
                <Row style={{ backgroundColor: "rgb(243, 243, 243)" }} className='mt-4'>
                    <Col lg={12}>
                        <center><h1 className='prod-manage-head'>Product Management</h1></center>
                        <Row>
                            <Col lg={sidevisible ? 8 : 11}>

                                <div style={{ backgroundColor: "white" }} className='pb-4 mb-5 mt-3 ms-5'>
                                    <h5 className="pt-4 ms-5">Add Products</h5>
                                    <form className='ms-5' onSubmit={sub}>
                                        <label>Product Name</label><br></br>
                                        <input type="text" required placeholder='product name' className='mt-1 mb-2 pro-inputs' onChange={(e) => pres(e.target.value)}></input><br></br>
                                        <label>Enter Price</label><br></br>
                                        <input type="number" required min="1" placeholder='price' className='mt-1 mb-2 pro-inputs' onChange={(e) => pricefn(e.target.value)}></input><br></br>
                                        <label>Category</label><br></br>
                                        <select className='mb-2 pro-inputs' value={category} onChange={handleChange}>
                                            <option value="all" >All</option>
                                            <option value="breakfast" >Breakfast</option>
                                            <option value="lunch">Lunch</option>
                                            <option value="dinner">Dinner</option>
                                        </select><br></br>
                                        <label>Description</label><br></br>
                                        <textarea placeholder='describe' required className='mt-1 mb-2 pro-inputs' onChange={(e) => desfn(e.target.value)}></textarea><br></br>
                                        <label>Upload Product image</label><br></br>
                                        <input type="file" placeholder='upload image' required className='mt-1 mb-2 pro-inputs' onChange={(e) => flres(e.target.files[0])}></input><br></br>
                                        <button type="submit" className='mt-2 btn btn-success'>submit</button>
                                    </form>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            {/* </Col> */}
        </>
    )
}

export default ProductArea