// import React from 'react'
// import { Container, Row, Col, Modal } from 'react-bootstrap'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";



// const ConfirmModal = ({ show, handleClose, cardname, cardnum, mail, subtotal, uid }) => {
//     const nav = useNavigate()

//     const order = async () => {
//         handlePayment()
//         const response = await axios.post('http://localhost:8080/user/postorder', { uid, subtotal })
//         console.log(response.data.data);
//         // nav('/successpage')
        
//     }

//     const { error, isLoading, Razorpay } = useRazorpay();

//     const handlePayment = () => {
//         const options: RazorpayOrderOptions = {
//             key: 'rzp_test_o23i8IDjUAc8c',
//             amount: 50000, // Amount in paise
//             currency: "INR",
//             name: "Test Company",
//             description: "Test Transaction",
//             order_id: "order_9A33XWu170gUtm", // Generate order_id on server
//             handler: (response) => {
//                 console.log(response);
//                 alert("Payment Successful!");
//             },
//             prefill: {
//                 name: "John Doe",
//                 email: "john.doe@example.com",
//                 contact: "9999999999",
//             },
//             theme: {
//                 color: "#F37254",
//             },
//         };

//         const razorpayInstance = new Razorpay(options);
//         razorpayInstance.open();
//     };

//     return (
//         <>
//             <Modal show={show} onHide={handleClose} className='mt-5'>
//                 <Container fluid>
//                     <Row className='justify-content-center'>
//                         <Col lg={8} className='mt-4'>
//                             <h4>Confirm your Payment</h4>
//                             <div>Quikly and secure,free transactions.</div>
//                         </Col>
//                     </Row>
//                     <Row className='justify-content-center mt-4'>
//                         <Col lg={8} className='cfm-details mb-4'>
//                             <div className='pt-4 pb-4 ps-2'>
//                                 <h6>Details </h6>
//                                 <div className='right-align mt-2'>
//                                     <div>cardholder name</div>
//                                     <div>{cardname}</div>
//                                 </div>
//                                 <div className='right-align mt-2'>
//                                     <div>Card Number</div>
//                                     <div>{cardnum}</div>
//                                 </div>
//                                 <div className='right-align mt-2'>
//                                     <div>Email</div>
//                                     <div>{mail}</div>
//                                 </div>
//                                 <hr></hr>
//                                 <div className='right-align'>
//                                     <div>Total Amount</div>
//                                     <div>₹{subtotal}</div>
//                                 </div>
//                             </div>
//                         </Col>
//                         <Row className='justify-content-center mb-4 mt-2'>
//                             <button className='cancel-p pt-2 pb-2' onClick={handleClose}>cancel payment</button>
//                             <button type="submit" className='confirm-p ms-3' onClick={order}>confirm payment</button>
//                         </Row>
//                     </Row>
//                 </Container>
//                 {/* <div>
//                     <h1>Payment Page</h1>
//                     {isLoading && <p>Loading Razorpay...</p>}
//                     {error && <p>Error loading Razorpay: {error}</p>}
//                     <button onClick={handlePayment} >
//                         Pay Now
//                     </button>
//                 </div> */}
//             </Modal>
//         </>
//     )
// }

// export default ConfirmModal



import React from 'react';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRazorpay } from "react-razorpay";

const ConfirmModal = ({ show, handleClose, cardname, cardnum, mail, subtotal, uid }) => {
    const nav = useNavigate();
    const { error, isLoading, Razorpay } = useRazorpay();

    const order = async () => {
        try {
            const response = await axios.post('http://localhost:8080/user/postorder', { uid, subtotal });
            const { order_id } = response.data; // Assuming your server returns order_id

            // Proceed to payment with the generated order_id
            handlePayment(order_id);
        } catch (error) {
            console.error('Order creation failed:', error);
            alert("Failed to create order. Please try again.");
        }
    };

    const handlePayment = (order_id) => {
        const options = {
            key: 'rzp_test_o23i8IDjUAc8c6', // Replace with your Razorpay key
            amount: subtotal * 100, // Convert to paise
            currency: "INR",
            name: "Test Company",
            description: "Test Transaction",
            order_id, // Use the dynamic order_id
            handler: async (response) => {
                try {
                    // Verify the payment on your server
                    const verificationResponse = await axios.post('http://localhost:8080/user/paymentverification', { response });
                    if (verificationResponse.data.success) {
                        alert("Payment Successful!");
                        nav('/successpage'); // Navigate to success page
                    } else {
                        alert("Payment verification failed.");
                    }
                } catch (error) {
                    alert("Payment verification failed.");
                    console.error('Payment verification error:', error);
                }
            },
            prefill: {
                name: cardname,
                email: mail,
                contact: "9999999999", // Replace with actual contact if available
            },
            theme: {
                color: "#F37254",
            },
        };

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
    };

    return (
        <Modal show={show} onHide={handleClose} className='mt-5'>
            <Container fluid>
                <Row className='justify-content-center'>
                    <Col lg={8} className='mt-4'>
                        <h4>Confirm your Payment</h4>
                        <div>Quickly and secure, free transactions.</div>
                    </Col>
                </Row>
                <Row className='justify-content-center mt-4'>
                    <Col lg={8} className='cfm-details mb-4'>
                        <div className='pt-4 pb-4 ps-2'>
                            <h6>Details </h6>
                            <div className='right-align mt-2'>
                                <div>Cardholder Name</div>
                                <div>{cardname}</div>
                            </div>
                            <div className='right-align mt-2'>
                                <div>Card Number</div>
                                <div>{cardnum}</div>
                            </div>
                            <div className='right-align mt-2'>
                                <div>Email</div>
                                <div>{mail}</div>
                            </div>
                            <hr />
                            <div className='right-align'>
                                <div>Total Amount</div>
                                <div>₹{subtotal}</div>
                            </div>
                        </div>
                    </Col>
                    <Row className='justify-content-center mb-4 mt-2'>
                        <button className='cancel-p pt-2 pb-2' onClick={handleClose}>Cancel Payment</button>
                        <button type="submit" className='confirm-p ms-3' onClick={order}>Confirm Payment</button>
                    </Row>
                </Row>
            </Container>
        </Modal>
    );
};

export default ConfirmModal;
