import { CartProvider } from "./context/CartContext";
import { FreelancersProvider } from "./context/FreeLancersContext";
import { UserProvider } from "./context/UserContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <UserProvider>
      <FreelancersProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </FreelancersProvider>
    </UserProvider>
  );
}

export default App;
