import { useEffect, useState } from "react";

function Stats() {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/tickets/stats/"
      );
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Ticket Statistics</h3>

      <p><b>Total tickets:</b> {stats.total_tickets}</p>
      <p><b>Open tickets:</b> {stats.open_tickets}</p>
      <p><b>Avg tickets per day:</b> {stats.avg_tickets_per_day}</p>

      <h4>Priority Breakdown</h4>
      <ul>
        {Object.entries(stats.priority_breakdown).map(
          ([key, value]) => (
            <li key={key}>{key}: {value}</li>
          )
        )}
      </ul>

      <h4>Category Breakdown</h4>
      <ul>
        {Object.entries(stats.category_breakdown).map(
          ([key, value]) => (
            <li key={key}>{key}: {value}</li>
          )
        )}
      </ul>
    </div>
  );
}

export default Stats;
