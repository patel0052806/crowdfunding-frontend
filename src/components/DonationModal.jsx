import { useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export const DonationModal = ({ campaign, onClose }) => {
    const [amount, setAmount] = useState("");
    const [donationComplete, setDonationComplete] = useState(false);
    const [receiptId, setReceiptId] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleDonate = async () => {
        const remaining = campaign.goal - campaign.raised;
        if (parseInt(amount) > remaining) {
            return toast.error(`You can only donate up to ${remaining}`);
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/donation/donate`, {
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

            const data = await response.json();
            if (response.ok) {
                setReceiptId(data.receiptId);
                setDonationComplete(true);
                toast.success("Donation successful!");
            } else {
                toast.error(data.message || "Donation failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Donation failed");
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
                        <h2>Donation Successful!</h2>
                        <button className="btn" onClick={handleViewReceipt}>View Receipt</button>
                        <button className="btn btn-close" onClick={onClose}>Close</button>
                    </>
                ) : (
                    <>
                        <h2>Donate to {campaign.title}</h2>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <button className="btn" onClick={handleDonate}>Donate</button>
                        <button className="btn btn-close" onClick={onClose}>Close</button>
                    </>
                )}
            </div>
        </div>
    );
};