import "../styles/Banner.scss";
import APP from "../assets/img/app-banner.png";
import APP_QR from "../assets/img/app-qr.png";
import AppStore from "../assets/img/applestore.png"
import GooglePlay from "../assets/img/googleplay.png"

const Banner = () => {
    return (
        <div className="banner-container">
            <div className="banner-content">
                <div className="text-content">
                    <div className="content-top">
                        <h1>
                            <span className="blue-text">B</span>etter
                            <span>&nbsp;</span>
                            <span className="blue-text">H</span>ealth for
                            <span>&nbsp;</span>
                            <span className="blue-text">E</span>ach
                            <span>&nbsp;</span>
                            <span className="blue-text">P</span>erson
                            <br />
                            <span className="blue-text">Theo dõi sức khỏe thông minh</span>
                            <br /> với ứng dụng BHEP
                        </h1>
                    </div>
                    {/* <div className="content-bottom">
                        <img src={APP_QR} alt="app-qr" />
                        <div className="btn-link">
                            <h2>Quét mã để tải ngay</h2>
                            <div className="app-link">
                                <img src={AppStore} alt="app-image" />
                                <img src={GooglePlay} alt="app-image" />
                            </div>
                        </div>

                    </div> */}
                </div>
                <div className="app-img">
                    <img src={APP} alt="app-image" />
                </div>
            </div>
        </div>
    );
}

export default Banner;
