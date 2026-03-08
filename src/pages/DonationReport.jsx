import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../store/auth";
import Loading from "../components/Loading";
import "./DonationReport.css";

export const DonationReport = () => {
    const [donations, setDonations] = useState([]);
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const params = useParams();
    const { token } = useAuth();

    const formatCurrency = (value) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(Number(value || 0));

    // aggregate donations per donor for summary
    const donorSummary = donations.reduce((acc, d) => {
        const key = d.donor?._id || d.donor?.username || "unknown";
        if (!acc[key]) {
            acc[key] = {
                username: d.donor?.username || "Unknown",
                total: 0,
                count: 0,
                last: null,
            };
        }
        acc[key].count += 1;
        acc[key].total += Number(d.amount || 0);
        const dt = new Date(d.createdAt);
        if (!acc[key].last || dt > acc[key].last) {
            acc[key].last = dt;
        }
        return acc;
    }, {});

    const donorSummaryArray = Object.values(donorSummary);

    const fetchReportData = async () => {
        try {
            const donationsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/donation/donations/${params.campaignId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!donationsResponse.ok) {
                throw new Error("Failed to load donations");
            }

            const donationsData = await donationsResponse.json();
            setDonations(Array.isArray(donationsData) ? donationsData : []);

            const campaignResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/data/campaigns/${params.campaignId}`, {
                method: "GET",
            });

            if (campaignResponse.ok) {
                const campaignData = await campaignResponse.json();
                setCampaign(campaignData);
            } else {
                const raisedFromDonations = (Array.isArray(donationsData) ? donationsData : []).reduce(
                    (sum, donation) => sum + Number(donation?.amount || 0),
                    0
                );
                setCampaign({ title: "Campaign", raised: raisedFromDonations, goal: 0 });
            }
        } catch (err) {
            console.error(err);
            setError("Unable to load donation report data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, [params.campaignId, token]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <section className="donation-report-page">
                <div className="container">
                    <h1 className="main-heading">Donation Report</h1>
                    <p className="donation-report-error">{error}</p>
                </div>
            </section>
        );
    }

    const raisedAmount = Number(campaign?.raised || 0);
    const goalAmount = Number(campaign?.goal || 0);
    const remainingAmount = Math.max(goalAmount - raisedAmount, 0);

    return (
        <section className="donation-report-page">
            <div className="container">
                <h1 className="main-heading">Donation Report</h1>
                <p className="donation-report-title">{campaign?.title || "Campaign"}</p>
            </div>

            <div className="container donation-report-summary">
                <div className="summary-card">
                    <h2>Amount Raised</h2>
                    <p>{formatCurrency(raisedAmount)}</p>
                </div>
                <div className="summary-card">
                    <h2>Goal</h2>
                    <p>{formatCurrency(goalAmount)}</p>
                </div>
                <div className="summary-card">
                    <h2>Remaining</h2>
                    <p>{formatCurrency(remainingAmount)}</p>
                </div>
            </div>

            {donorSummaryArray.length > 0 && (
                <div className="container donation-table-wrapper">
                    <h2 className="donation-table-heading">Donor Summary</h2>
                    <table className="donation-table">
                        <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Donor</th>
                                <th>Times</th>
                                <th>Total Amount</th>
                                <th>Last Donation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donorSummaryArray.map((d, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{d.username}</td>
                                    <td>{d.count}</td>
                                    <td>{formatCurrency(d.total)}</td>
                                    <td>{d.last ? d.last.toLocaleString() : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="container donation-table-wrapper">
                <h2 className="donation-table-heading">Detailed Donations</h2>
                <table className="donation-table">
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Donor</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.length > 0 ? (
                            donations.map((donation, index) => {
                                const date = new Date(donation.createdAt);
                                return (
                                    <tr key={donation._id || index}>
                                        <td>{index + 1}</td>
                                        <td>{donation.donor?.username || "Unknown"}</td>
                                        <td>{formatCurrency(donation.amount)}</td>
                                        <td>{date.toLocaleDateString()}</td>
                                        <td>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="empty-row">
                                    No donations found for this campaign.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};


