import NavBar from "../components/NavBar";
import Profile from "../components/Profile";
import Footer from "../components/Footer";

export default function ProfilePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'max-content' }}>
      <NavBar />
      <Profile />
      <Footer />
    </div>
  );
}
