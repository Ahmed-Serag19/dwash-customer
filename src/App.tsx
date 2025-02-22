import { FreelancersProvider } from "./context/FreeLancersContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <FreelancersProvider>
      <AppRoutes />
    </FreelancersProvider>
  );
}

export default App;
