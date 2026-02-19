import TicketForm from "./TicketForm";
import TicketList from "./TicketList";
import Stats from "./Stats";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Support Ticket System</h2>

      <TicketForm />
      <Stats />
      <TicketList />
    </div>
  );
}

export default App;
