import {useEffect, useState} from 'react';
import './Product.css';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {addProduct, deleteProduct, editProduct, findProducts} from "../../api.js";
import {ProductModal} from "./ProductModal.jsx";
import {TrModal} from "./TrModal.jsx";

export default function Products() {
    const navigate = useNavigate();
    const { companyLink } = useParams();
    const location = useLocation();
    const [title, setTitle] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [prdId, setPrdId] = useState(null);
    const [isModalTrOpen, setIsModalTrOpen] = useState(false);
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
    const handleTr = (e, id) => {
        e.preventDefault();
        setPrdId(id);
        setTitle('Edit');
        setIsModalTrOpen(true);
    }
    const handleChange = (e) => {
        if(e.target.id === 'price'){
            if (/^\d*\.?\d*$/.test(e.target.value)) {
                setForm({
                    ...form,
                    price: e.target.value,
                });
            }
        }else {
            setForm({
                ...form,
                [e.target.id]: e.target.value,
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
    const handleDelete = async (e) => {
       e.preventDefault();
       setIsModalTrOpen(false);
      const result = confirm('Are you sure, delete product ?');
      if (result) {
          const res = await deleteProduct(prdId, form.companyId);
          if (res.message) {
              alert(res.message);
          }else {
              alert('Delete product successful!');
              setIsChange((prevState) => !prevState);
          }
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
    // модал возможно лучше вынести в отдельный компонент
    return (
        <div className="products-page">
            <div className="products-header">
                <h1>Products</h1>
                <div>
                 <button className="products-add-button" onClick={() => navigate(`/${companyLink}/dashboard`)}>Dashboard</button>
                 <button className="products-add-button" onClick={() => {setIsModalOpen(true); setTitle('Add');}}>+ Add product</button>
                </div>
            </div>
            <div className="products-main">
                <table>
                    <thead>
                      <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Price</th>
                          {/*<th>Status</th>*/}
                      </tr>
                    </thead>
                    <tbody>
                    {(stateData?.products || []).map((pr,index) => (<tr key={index} onClick={(e) => handleTr(e, pr.id)}>
                        <td>{pr.id}</td>
                        <td>{pr.name}</td>
                        <td>{pr.description}</td>
                        <td>${pr.price}</td>
                        {/*<td>{pr.id}</td>*/}
                    </tr>))}
                    </tbody>
                </table>
            </div>
            {isModalTrOpen && <TrModal handleDelete={handleDelete} setIsModalTrOpen={setIsModalTrOpen} setIsModalOpen={setIsModalOpen}/>}
            {isModalOpen && <ProductModal handleSubmit={handleSubmit} handleChange={handleChange} form={form} setIsModalOpen={setIsModalOpen} title={title}/>}
        </div>
    );
}