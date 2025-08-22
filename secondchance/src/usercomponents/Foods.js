import React, { useState, useEffect } from 'react'
import { Col, Card, Button, Modal, Container, Row, Badge } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AddCartModal from './AddCartModal'

const Foods = () => {
  const nav = useNavigate()
  const [pro, prores] = useState([])

  

  useEffect(() => {
    axios.get(`http://localhost:8080/user/getproduct`).then(response => {
      console.log(response.data.data);
      prores(response.data.data)
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
    if (qty == "" || qty<=0) {
      alert("Please enter a valid quantity")
    }
    else {
      if (uid) {
        try {
          const response = await axios.post('http://localhost:8080/user/addcart', { id, uid, qty })
          console.log(response.data);
          if (response.data.data == "no stock") {
            alert(response.data.message || "Sorry, this item is out of stock or insufficient stock available")
          }
          else if (response.data.data == "ok") {
            alert(response.data.message || "Item added to cart successfully!")
            nav('/cart')
          }
          else if (response.data.data == "Product not found") {
            alert("Product not found. Please try again.")
          }
          else if (response.data.data == "error") {
            alert("Server error occurred. Please try again.")
          }
        } catch (error) {
          console.error('Error adding to cart:', error);
          alert("Error adding item to cart. Please try again.")
        }
      }
      else {
        alert("Please login to add item to cart")
      }
    }
  }

  const getStockBadge = (stock) => {
    if (stock <= 0) {
      return <Badge bg="danger">Out of Stock</Badge>
    } else if (stock <= 5) {
      return <Badge bg="warning" text="dark">Low Stock ({stock})</Badge>
    } else {
      return <Badge bg="success">In Stock ({stock})</Badge>
    }
  }

  return (
    <>{pro.map((i) => (
      <Col lg={3} style={{ marginTop: "80px", marginBottom: "80px" }}>
        <Card style={{ width: '18rem' }} className='food-card'>
          <Card.Img variant="top" className='food-card-image' src={`${img}${i.image}`} height="230px" width="10px" />
          <Card.Body>
            <Card.Title className='text-center'>{i.name}</Card.Title>
            <hr></hr>
            <div className='d-flex justify-content-between align-items-center'>
              <button 
                className='top-coll-btn ms-3' 
                onClick={() => prospec(i._id)}
                disabled={i.stock <= 0}
                style={{ 
                  opacity: i.stock <= 0 ? 0.6 : 1,
                  cursor: i.stock <= 0 ? 'not-allowed' : 'pointer'
                }}
              >
                {i.stock <= 0 ? 'Out of Stock' : 'Order'}
              </button>
              <div className='price-style text-end'>₹{i.price}</div>
            </div>
            <div className='mt-2 text-center'>
              {getStockBadge(i.stock)}
            </div>
          </Card.Body>
        </Card>
      </Col>
    ))}
      <AddCartModal show={show} closepro={closepro} img={img} specpro={specpro} addcart={addcart} addqt={addqt} qty={qty} qtres={qtres} subqt={subqt} />
    </>
  )
}

export default Foods