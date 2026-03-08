import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../store/auth";
import Loading from "../components/Loading";
import "./AdminReport.css";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export const AdminReport = () => {
  const [report, setReport] = useState(null);
  const [campaignList, setCampaignList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("total");
  const { token } = useAuth();

  const fetchReport = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/campaigns/report`, {
        method: "GET",
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

  const fetchCampaignList = async (status = "total") => {
    setTableLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/campaigns/report/list?status=${status}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCampaignList(Array.isArray(data) ? data : []);
      } else {
        setCampaignList([]);
      }
    } catch (e) {
      console.error(e);
      setCampaignList([]);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    fetchCampaignList("total");
  }, []);

  const handleFilterChange = (status) => {
    setActiveFilter(status);
    fetchCampaignList(status);
  };

  const stats = useMemo(() => {
    if (!report) {
      return [];
    }

    return [
      { key: "approved", label: "Approved", value: Number(report.approved || 0), color: "#16a34a" },
      { key: "rejected", label: "Rejected", value: Number(report.rejected || 0), color: "#ef4444" },
      { key: "pending", label: "Pending", value: Number(report.pending || 0), color: "#f59e0b" },
    ];
  }, [report]);

  if (loading) {
    return <Loading />;
  }

  if (!report) {
    return (
      <section className="admin-report">
        <div className="container report-container">
          <p className="report-error">Unable to load report.</p>
        </div>
      </section>
    );
  }

  const total = Number(report.total || 0);

  const chartData = {
    labels: stats.map((s) => s.label),
    datasets: [
      {
        label: "Campaigns",
        data: stats.map((s) => s.value),
        backgroundColor: stats.map((s) => s.color),
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "58%",
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed}`,
        },
      },
    },
  };

  const filterLabelMap = {
    total: "All Campaigns",
    approved: "Approved Campaigns",
    rejected: "Rejected Campaigns",
    pending: "Pending Campaigns",
  };

  return (
    <section className="admin-report">
      <div className="container report-container">
        <div className="report-hero">
          <h1 className="main-heading">Campaign Report</h1>
          <p className="report-subtitle">Click cards to view status-wise campaigns in table.</p>
        </div>

        <div className="report-metrics">
          <button
            type="button"
            className={`metric-card metric-total clickable ${activeFilter === "total" ? "active" : ""}`}
            onClick={() => handleFilterChange("total")}
          >
            <p className="metric-label">Total Campaigns</p>
            <p className="metric-value">{total}</p>
          </button>

          {stats.map((item) => (
            <button
              type="button"
              className={`metric-card clickable ${activeFilter === item.key ? "active" : ""}`}
              key={item.key}
              onClick={() => handleFilterChange(item.key)}
            >
              <p className="metric-label">{item.label}</p>
              <p className="metric-value">{item.value}</p>
            </button>
          ))}
        </div>

        <div className="report-grid">
          <div className="chart-panel">
            <h2>Status Distribution</h2>
            <div className="chart-canvas-wrap">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="breakdown-panel">
            <h2>Breakdown</h2>
            <div className="breakdown-list">
              {stats.map((item) => {
                const percent = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0";
                return (
                  <div className="breakdown-item" key={item.key}>
                    <div className="breakdown-top">
                      <span className="status-label">
                        <span className="status-dot" style={{ backgroundColor: item.color }} />
                        {item.label}
                      </span>
                      <strong>{percent}%</strong>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${percent}%`, backgroundColor: item.color }} />
                    </div>
                    <p className="status-count">{item.value} campaigns</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="campaign-table-section">
          <div className="table-heading-row">
            <h2>{filterLabelMap[activeFilter]}</h2>
            <span>{campaignList.length} records</span>
          </div>

          <div className="campaign-table-wrap">
            <table className="campaign-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th className="col-title">Title</th>
                  <th className="col-category">Category</th>
                  <th>Goal</th>
                  <th>Raised</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tableLoading ? (
                  <tr>
                    <td colSpan="7" className="empty-row">Loading campaigns...</td>
                  </tr>
                ) : campaignList.length > 0 ? (
                  campaignList.map((campaign, index) => (
                    <tr key={campaign._id || index}>
                      <td>{index + 1}</td>
                      <td className="col-title">{campaign.title || "-"}</td>
                      <td className="col-category">{campaign.category || "General"}</td>
                      <td>${Number(campaign.goal || 0).toLocaleString()}</td>
                      <td>${Number(campaign.raised || 0).toLocaleString()}</td>
                      <td>{campaign.deadline ? new Date(campaign.deadline).toLocaleDateString() : "-"}</td>
                      <td>
                        <span className={`table-status status-${campaign.status || "pending"}`}>
                          {campaign.status || "pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="empty-row">No campaigns found for this filter.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};



