import { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import Loading from "../components/Loading";
import "./AdminReport.css";

// charting
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export const AdminReport = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    const fetchReport = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/campaigns/report`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setReport(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (!report) {
        return <p>Unable to load report.</p>;
    }

    // prepare chart data
    const chartData = {
        labels: ['Approved', 'Rejected', 'Pending'],
        datasets: [
            {
                label: 'Campaigns',
                data: [report.approved, report.rejected, report.pending],
                backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Campaign Status Distribution' },
        },
    };

    return (
        <section className="admin-report">
            <div className="container">
                <h1 className="main-heading">Campaign Report</h1>

                {/* chart section */}
                <div className="chart-wrapper">
                    <Doughnut data={chartData} options={chartOptions} />
                </div>

                <div className="report-cards">
                    <div className="card">
                        <h2>Total</h2>
                        <p>{report.total}</p>
                    </div>
                    <div className="card">
                        <h2>Approved</h2>
                        <p>{report.approved}</p>
                    </div>
                    <div className="card">
                        <h2>Rejected</h2>
                        <p>{report.rejected}</p>
                    </div>
                    <div className="card">
                        <h2>Pending</h2>
                        <p>{report.pending}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};
