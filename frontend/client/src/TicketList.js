import { useEffect, useState } from "react";

function TicketList() {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/tickets/");
      const data = await response.json();
      setTickets(data);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>All Tickets</h3>

      {tickets.length === 0 && <p>No tickets found</p>}

      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h4>{ticket.title}</h4>
          <p>{ticket.description}</p>
          <p><b>Category:</b> {ticket.category}</p>
          <p><b>Priority:</b> {ticket.priority}</p>
          <p><b>Status:</b> {ticket.status}</p>
          <p>
            <b>Created:</b>{" "}
            {new Date(ticket.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default TicketList;
