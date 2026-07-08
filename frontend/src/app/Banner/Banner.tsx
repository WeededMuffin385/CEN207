import "./Banner.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
export default function Banner() {
    return (
        <section id="carouselExampleIndicators" className="carousel slide banner">
            <div className="carousel-indicators">
                <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="0"
                    className="active"
                    aria-current="true"
                    aria-label="Slide 1"
                ></button>
                <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="1"
                    aria-label="Slide 2"
                ></button>
                <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="2"
                    aria-label="Slide 3"
                ></button>
            </div>
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <title>huhu</title>
                    <img
                        src="C:\Users\Zenzy\Documents\GitHub\CEN207\frontend\public\7946435.jpg"
                        className="d-block w-100"
                        alt="Robot Vacuum and Mop"
                    />
                    <div className="carousel-caption d-none d-md-block">
                        <h2>huhu</h2>
                    </div>
                </div>
                <div className="carousel-item">
                    <img
                        src="C:\Users\Zenzy\Documents\GitHub\CEN207\frontend\public\7946435.jpg"
                        className="d-block w-100"
                        alt="Wireless Headphones"
                    />
                    <div className="carousel-caption d-none d-md-block">
                        <h2>huhu</h2>
                    </div>
                </div>
                <div className="carousel-item">
                    <title>huhu</title>
                    <img
                        src="C:\Users\Zenzy\Documents\GitHub\CEN207\frontend\public\cd379788-26fb-45e2-bf62-0b5c01fa3459.jpg"
                        className="d-block w-100"
                        alt="Bluetooth Speaker"
                    />
                    <div className="carousel-caption d-none d-md-block">
                        <h2>huhu</h2>
                    </div>
                </div>
            </div>
            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="prev"
            >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="next"
            >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </section>
    );
}