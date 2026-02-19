import { useState } from "react";

function TicketForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState("low");
  const [loading, setLoading] = useState(false);

  const classifyTicket = async (text) => {
    if (!text) return;

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8000/api/tickets/classify/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: text }),
        }
      );

      if (!response.ok) throw new Error("Classify failed");

      const data = await response.json();
      setCategory(data.suggested_category);
      setPriority(data.suggested_priority);
    } catch (err) {
      console.error("LLM classify failed", err);
      // fallback already handled in backend
    }
    setLoading(false);
  };

  const submitTicket = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(
        "http://localhost:8000/api/tickets/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            category,
            priority,
          }),
        }
      );
  
      const data = await response.json();
      console.log("Ticket created:", data);
  
      // SUCCESS — clear form
      setTitle("");
      setDescription("");
      setCategory("general");
      setPriority("low");
  
      alert("Ticket submitted successfully!");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to submit ticket");
    }
  };
  

  return (
    <form onSubmit={submitTicket}>
      <div>
        <label>Title</label><br />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Description</label><br />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => classifyTicket(description)}
          required
        />
      </div>

      {loading && <p>Classifying ticket...</p>}

      <div>
        <label>Category</label><br />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="billing">Billing</option>
          <option value="technical">Technical</option>
          <option value="account">Account</option>
          <option value="general">General</option>
        </select>
      </div>

      <div>
        <label>Priority</label><br />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <button type="submit">Submit Ticket</button>
    </form>
  );
}

export default TicketForm;
