import Footer from "../../Footer";
import NavBar from "../../Header";
import "./index.scss"
const DefaultLayout = ({ children }) => {
  return (
    <>
    <NavBar />
    <div className="container">
      <div className="content">
        {children}
      </div>
      <Footer />
    </div>
  </>
  );
};

export default DefaultLayout;
