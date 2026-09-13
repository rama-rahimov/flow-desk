import {useEffect, useState} from 'react';
import './Product.css';
import {useLocation, useNavigate} from "react-router-dom";
import {addProduct, deleteProduct, editProduct, findProducts} from "../../api.js";

export default function Products() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChange, setIsChange] = useState(false);
    const [stateData, setStateData] = useState(location.state);
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        status: "USD",
        companyId: stateData.companyId,
        id: 0
    });
    const handleChange = (e) => {
        if(e.target.name === 'price'){
            if (/^\d*\.?\d*$/.test(e.target.value)) {
                setForm({
                    ...form,
                    price: e.target.value,
                });
            }
        }else {
            setForm({
                ...form,
                [e.target.name]: e.target.value,
            })
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let res = {};
        if(form.id){
            const {price, companyId, ...data} = form;
            res = await editProduct({...data, price: Number(price)});
        }else {
            res = await addProduct({...form, price: Number(form.price)});
        }
        if (res.message) {
            alert(res.message);
        }else {
            alert('Operation successful!');
            setIsChange((prevState) => !prevState);
        }
        setIsModalOpen(false);
        setForm({
            name: '',
            description: '',
            price: '',
            status: "USD",
            companyId: stateData.companyId
        });
    };
    const handleDelete = async (e,id) => {
       e.preventDefault();
      const res = await deleteProduct(id);
      if (res.message) {
          alert(res.message);
      }else {
          alert('Delete product successful!');
          setIsChange((prevState) => !prevState);
      }
    }
    useEffect(() => {
        (async () => {
         const products = await findProducts(form.companyId);
         setStateData((prevState) => ({
             ...prevState, products
         }));
        })()
    },[isChange]);
    return (
        <div className="products-page">
            <div className="products-header">
                <h1>Products</h1>
                <button
                    className="products-add-button"
                    onClick={() => navigate(`/${stateData.companyName}/dashboard`)}
                >
                    Dashboard
                </button>
                <button
                    className="products-add-button"
                    onClick={() => {
                        setIsModalOpen(true);
                    }}
                >
                    + Add product
                </button>
            </div>

            <div className="products-list">
                {(stateData?.products || []).map((pr) => (
                    <div className="product-card" key={pr.id}>
                        <div>
                            <h2>{pr.name}</h2>
                            <p>{pr.description}</p>
                        </div>

                        <div className="product-info">
                            <div className="product-price">
                                <span className="product-price-label">
                                    Price
                                </span>

                                <span className="product-price-value">
                                    {pr.price}
                                </span>
                            </div>

                            <div>
                                <button onClick={() => {
                                    setIsModalOpen(true);
                                    setForm((prevState) => ({...prevState, id: pr.id}))
                                }}>Edit</button>
                                <button onClick={(e) => handleDelete(e,pr.id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="product-modal">

                        <div className="modal-header">
                            <h2>Add Product</h2>

                            <button
                                className="modal-close"
                                onClick={() => setIsModalOpen(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>

                            <label>
                                Name
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label>
                                Description
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label>
                                Price
                                <input
                                    type="text"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    inputMode="decimal"
                                    required
                                />
                            </label>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>

                                <button type="submit" onClick={handleSubmit}>
                                    Save
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}