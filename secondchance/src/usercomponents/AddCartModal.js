import React from 'react'
import { Container, Row, Col, Modal, Alert } from 'react-bootstrap'


const AddCartModal = ({show,closepro,img,specpro,addcart,addqt,subqt,qtres,qty}) => {
    const isOutOfStock = specpro.stock <= 0;
    const maxQuantity = specpro.stock || 0;
    
    const handleAddQt = () => {
        if (qty < maxQuantity) {
            addqt();
        }
    };
    
    const handleQtRes = (value) => {
        const numValue = parseInt(value) || 1;
        if (numValue <= maxQuantity && numValue > 0) {
            qtres(numValue);
        }
    };

    return (
        <>
            <Modal size="lg" show={show} onHide={closepro} className='mt-5'>
                <Container fluid>
                    <Row className='mt-4 mb-4'>
                        <Col lg={6}>
                            <img src={`${img}${specpro.image}`} height="350px" width="350px" alt={specpro.name}></img>
                        </Col>
                        <Col lg={6} className='mt-1'>
                            <h4>{specpro.name}</h4>
                            <div className='modal-price mt-1'>₹ {specpro.price}.00</div>
                            <p className='mt-3'>{specpro.description}</p>
                            
                            {/* Stock Information */}
                            <div className='mt-3'>
                                {isOutOfStock ? (
                                    <Alert variant="danger" className="py-2">
                                        <strong>Out of Stock</strong>
                                    </Alert>
                                ) : (
                                    <Alert variant="info" className="py-2">
                                        <strong>Stock Available:</strong> {specpro.stock} items
                                    </Alert>
                                )}
                            </div>
                            
                            <div className='d-flex mt-4'>
                                <button 
                                    className='add-cart pb-2 pt-2' 
                                    onClick={() => addcart(specpro._id)}
                                    disabled={isOutOfStock}
                                    style={{ 
                                        opacity: isOutOfStock ? 0.6 : 1,
                                        cursor: isOutOfStock ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                                {!isOutOfStock && (
                                    <div className='qt-box ms-3 d-flex'>
                                        <div 
                                            className='plus ms-5 pt-1' 
                                            onClick={handleAddQt}
                                            style={{ 
                                                cursor: qty >= maxQuantity ? 'not-allowed' : 'pointer',
                                                opacity: qty >= maxQuantity ? 0.6 : 1
                                            }}
                                        >
                                            +
                                        </div>
                                        <form>
                                            <input 
                                                type="number" 
                                                value={qty} 
                                                required 
                                                className='ms-3 pt-2' 
                                                min='1' 
                                                max={maxQuantity}
                                                style={{ border: "none", background: "none", width: "50px" }} 
                                                onChange={(e) => handleQtRes(e.target.value)}
                                            ></input>
                                        </form>
                                        <div 
                                            className='minus' 
                                            onClick={subqt}
                                            style={{ 
                                                cursor: qty <= 1 ? 'not-allowed' : 'pointer',
                                                opacity: qty <= 1 ? 0.6 : 1
                                            }}
                                        >
                                            -
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Modal>
        </>
    )
}

export default AddCartModal