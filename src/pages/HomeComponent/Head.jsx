import {useEffect, useState} from "react";
import {checkCompany, cookie, findProducts, test_prod_url} from "../../api.js";
import {useNavigate, useParams} from "react-router-dom";
import lion from "../../images/justlion.jpg";
import {io} from "socket.io-client";

export function Head() {
    const navigate = useNavigate();
    const { companyLink } = useParams();
    const [products, setProducts] = useState([]);
    useEffect(() => {
        (async () => {
            console.log('1. BEFORE cookie');
            const cookies = await cookie();
            console.log('2. AFTER cookie');
            const socket = io(test_prod_url, {
                withCredentials: true
            });
            console.log('3. AFTER io()');
            socket.on("connect", async () => {
                console.log('4. SOCKET CONNECTED');
                socket.emit('message', 'Helloooouu');
                console.log("Emit!");
            })
            socket.on('response', (msg) => {
                console.log(msg);
            })
          const company = await checkCompany(companyLink);
          if(company?.success){
              const getProducts = await findProducts(company.data.id);
              if(getProducts?.length){
                setProducts(getProducts);
              }
          }
        })()
    },[]);
    console.log({products});
    return (
        <div className="client-page">
            <header className="client-header">
                <div className="client-logo">
                    FlowDesk
                </div>
                <nav className="client-nav">
                    <a href="#products">Products</a>
                    <a href="#about">About</a>
                    <a href="#contact">Contact</a>
                </nav>
                <button className="login-button" onClick={() => navigate(`/${companyLink}/register`)}>
                    Register
                </button>
                <button className="login-button">
                    Login
                </button>
            </header>

            <main>
                <section className="hero">
                    <div className="hero-content">
                        <p className="hero-label">Welcome to our company</p>

                        <h1>
                            Everything you need,
                            <br />
                            in one place.
                        </h1>

                        <p className="hero-description">
                            Discover our products and services and find
                            everything you need for your business.
                        </p>

                        <a href="#products" className="hero-button">
                            View products
                        </a>
                    </div>
                </section>

                <section id="products" className="products-section">
                    <div className="section-heading">
                        <p>Our products</p>
                        <h2>What we offer</h2>
                    </div>
                    <div className="products-grid">
                        {products.map(((el, ind) => (<div key={ind} className="product-card">
                            <div className="product-image"><img src={lion}/></div>
                            <h3>{el.name}</h3>
                            <p>{el.description}</p>
                            <div className="product-bottom">
                                <span>{'$'+el.price}</span>
                                <button>View</button>
                            </div>
                        </div>)))}
                    </div>
                </section>

                <section id="about" className="about-section">
                    <div className="about-content">
                        <p>About us</p>

                        <h2>
                            We help businesses
                            <br />
                            grow and work smarter.
                        </h2>

                        <p>
                            Our company provides reliable products and
                            services designed to make everyday work
                            easier and more efficient.
                        </p>
                    </div>
                </section>

                <section id="contact" className="contact-section">
                    <h2>Have any questions?</h2>

                    <p>
                        Contact us and we will be happy to help you.
                    </p>

                    <button>Contact us</button>
                </section>
            </main>

            <footer className="client-footer">
                <div>
                    <strong>FlowDesk</strong>
                    <p>Simple business management.</p>
                </div>

                <div>
                    <p>© 2026 FlowDesk</p>
                </div>
            </footer>
        </div>
    );
}