import { useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from 'react-toastify';

export const DonationModal = ({ campaign, onClose }) => {
    const [amount, setAmount] = useState("");
    const { token } = useAuth();

    const handleDonate = async () => {
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

            if (response.ok) {
                toast.success("Donation successful");
                onClose();
            } else {
                toast.error("Donation failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Donation failed");
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Donate to {campaign.title}</h2>
                <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button className="btn" onClick={handleDonate}>Donate</button>
                <button className="btn btn-close" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};