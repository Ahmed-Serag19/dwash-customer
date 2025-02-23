import { FreelancersProvider } from "./context/FreeLancersContext";
import { UserProvider } from "./context/UserContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <UserProvider>
      <FreelancersProvider>
        <AppRoutes />
      </FreelancersProvider>
    </UserProvider>
  );
}

export default App;
