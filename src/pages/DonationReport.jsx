import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../store/auth";

export const DonationReport = () => {
    const [donations, setDonations] = useState([]);
    const params = useParams();
    const { token } = useAuth();

    const fetchDonations = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/donation/donations/${params.campaignId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setDonations(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    return (
        <section className="section-donations">
            <div className="container">
                <h1 className="main-heading">Donation Report</h1>
            </div>
            <div className="container">
                <table>
                    <thead>
                        <tr>
                            <th>Donor</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map((donation, index) => (
                            <tr key={index}>
                                <td>{donation.donor.username}</td>
                                <td>${donation.amount}</td>
                                <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};