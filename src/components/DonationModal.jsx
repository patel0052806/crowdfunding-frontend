import { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export const DonationModal = ({ campaign, onClose }) => {
    const [amount, setAmount] = useState("");
    const [donationComplete, setDonationComplete] = useState(false);
    const [receiptId, setReceiptId] = useState(null);
    const [loading, setLoading] = useState(false);
    const { token, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    const handleDonate = async () => {
        if (!amount || parseInt(amount) <= 0) {
            return toast.error("Please enter a valid amount");
        }

        const remaining = campaign.goal - campaign.raised;
        if (parseInt(amount) > remaining) {
            return toast.error(`You can only donate up to ₹${remaining}`);
        }

        setLoading(true);

        try {
            // Step 1: Create order on backend
            console.log('Creating order...', { campaignId: campaign._id, amount: parseInt(amount) });
            
            const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    campaignId: campaign._id,
                    amount: parseInt(amount),
                }),
            });

            console.log('Order response status:', orderResponse.status);
            const orderData = await orderResponse.json();
            console.log('Order data:', orderData);

            if (!orderResponse.ok) {
                setLoading(false);
                return toast.error(orderData.message || "Failed to create payment order");
            }

            if (!orderData.orderId || !orderData.key_id) {
                setLoading(false);
                return toast.error("Invalid order data received");
            }

            // Step 2: Open Razorpay checkout
            const options = {
                key: orderData.key_id, // Razorpay key
                amount: orderData.amount, // Amount in paise
                currency: orderData.currency,
                order_id: orderData.orderId, // Order ID from backend - REQUIRED
                name: "LaunchPad Crowdfunding", // Store name
                description: `Donation to ${campaign.title}`, // Description
                prefill: {
                    name: user?.username || "User",
                    email: user?.email || "",
                    contact: user?.phone || "",
                },
                theme: {
                    color: "#3b82f6", // Brand color
                },
                handler: async (response) => {
                    try {
                        console.log('Payment successful:', response);
                        // Step 3: Verify payment on backend
                        const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verify-payment`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                orderId: orderData.orderId,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                                campaignId: campaign._id,
                                amount: parseInt(amount),
                            }),
                        });

                        const verifyData = await verifyResponse.json();
                        console.log('Verify response:', verifyData);
                        
                        if (verifyResponse.ok) {
                            setReceiptId(verifyData.receiptId);
                            setDonationComplete(true);
                            toast.success("Donation successful! Receipt sent to your email.");
                        } else {
                            toast.error(verifyData.message || "Payment verification failed");
                        }
                    } catch (error) {
                        console.error("Verification error:", error);
                        toast.error("Payment verification failed");
                    } finally {
                        setLoading(false);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                        toast.info("Payment cancelled");
                    }
                }
            };

            console.log('Opening Razorpay with options:', options);
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Error:", error);
            setLoading(false);
            toast.error("Something went wrong: " + error.message);
        }
    };

    const handleViewReceipt = () => {
        navigate(`/receipt/${receiptId}`);
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                {donationComplete ? (
                    <>
                        <h2>✓ Donation Successful!</h2>
                        <p style={{ color: '#3b82f6', fontWeight: 600 }}>Thank you for your generous donation!</p>
                        <button className="btn" onClick={handleViewReceipt}>View Receipt</button>
                        <button className="btn btn-close" onClick={onClose}>Close</button>
                    </>
                ) : (
                    <>
                        <h2>Donate to {campaign.title}</h2>
                        <div style={{ marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>
                                Goal: ₹{campaign.goal} | Raised: ₹{campaign.raised} | Remaining: ₹{campaign.goal - campaign.raised}
                            </p>
                        </div>
                        <input
                            type="number"
                            placeholder="Enter donation amount (₹)"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={loading}
                            style={{ marginBottom: '1rem' }}
                        />
                        <button 
                            className="btn" 
                            onClick={handleDonate}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Donate via Razorpay"}
                        </button>
                        <button className="btn btn-close" onClick={onClose} disabled={loading}>Close</button>
                    </>
                )}
            </div>
        </div>
    );
};