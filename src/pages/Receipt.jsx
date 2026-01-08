import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAuth } from "../store/auth";
import Loading from "../components/Loading";
import "./Receipt.css";

export const Receipt = () => {
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const { receiptId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const receiptRef = useRef();

    useEffect(() => {
        const fetchReceipt = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/donation/receipts/${receiptId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error("Failed to fetch receipt");
                const data = await response.json();
                setReceipt(data);
            } catch (error) {
                console.error(error);
                navigate("/404");
            } finally {
                setLoading(false);
            }
        };
        if (receiptId && token) {
            fetchReceipt();
        }
    }, [receiptId, token, navigate]);

    const handleDownload = () => {
        const input = receiptRef.current;
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`receipt-${receipt.donationId}.pdf`);
        });
    };

    if (loading) {
        return <Loading />;
    }

    if (!receipt) {
        return <div className="receipt-container"><h2>Receipt not found.</h2></div>;
    }

    return (
        <div>
            <div ref={receiptRef} className="receipt-container">
                <div className="receipt-header">
                    <h1>Donation Receipt</h1>
                    <p>Thank you for your generous contribution!</p>
                </div>

                <div className="receipt-details">
                    <h2>Donation Details</h2>
                    <div className="detail-item">
                        <span>Receipt ID:</span>
                        <span>{receipt.donationId}</span>
                    </div>
                    <div className="detail-item">
                        <span>Transaction Date:</span>
                        <span>{new Date(receipt.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="receipt-details">
                    <h2>Campaign & Donor</h2>
                    <div className="detail-item">
                        <span>Campaign:</span>
                        <span>{receipt.campaignTitle}</span>
                    </div>
                    <div className="detail-item">
                        <span>Donor:</span>
                        <span>{receipt.donor.username}</span>
                    </div>
                    <div className="detail-item">
                        <span>Email:</span>
                        <span>{receipt.donor.email}</span>
                    </div>
                </div>

                <div className="receipt-summary">
                    <div className="summary-item total">
                        <span>Amount Donated:</span>
                        <span>${receipt.amount.toFixed(2)}</span>
                    </div>
                </div>

                <div className="receipt-footer">
                    <p>This is an official receipt for your donation.</p>
                    <p>Crowdfunding Platform &copy; {new Date().getFullYear()}</p>
                </div>
            </div>
            <button onClick={handleDownload} className="download-btn">
                Download PDF
            </button>
        </div>
    );
};