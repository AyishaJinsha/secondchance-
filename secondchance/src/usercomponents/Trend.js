import React, { useState, useEffect } from 'react'
import { Col, Card, Button } from 'react-bootstrap'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from 'axios';
import AddCartModal from './AddCartModal';
import { useNavigate } from 'react-router-dom';

const Trend = () => {

    const nav = useNavigate()
    const [pro, prores] = useState([])

    useEffect(() => {
        axios.get(`http://localhost:8080/user/getproduct`).then(response => {
            console.log(response.data.data);
            prores(response.data.data)
        })
    }, [])
    const img = 'http://localhost:8080/uploads/'



    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4,
            slidesToSlide: 1 // optional, default to 1.
        },
        mid: {
            breakpoint: { max: 1024, min: 912 },
            items: 2,
            slidesToSlide: 1 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 912, min: 512 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 512, min: 0 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        }
    };

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




    return (
        <>  <Carousel
            responsive={responsive}
            swipeable={true}
            draggable={true}

        >
            {pro.map((i) => (
                <Col lg={2} className='mt-4 col-items'>
                    <div className='d-flex'><div className='price-style'>₹{i.price}</div><img src={`${img}${i.image}`} width="150px" height="150px" className="trend-image"></img></div>
                    <div className='trend-name'>{i.name}</div>
                    <div className='trend-desc mt-2'>Restraunt recommendation</div>
                    <div className='mt-2'>4.5</div>
                    <button className='trend-buy-button' onClick={() => prospec(i._id)}>Order now</button>
                </Col>
            ))}
        </Carousel>
            <AddCartModal show={show} closepro={closepro} img={img} specpro={specpro} addcart={addcart} addqt={addqt} qty={qty} qtres={qtres} subqt={subqt} />
        </>
    )
}

export default Trend