import {useEffect, useState} from 'react';
import './Payment.css';
import {updateSubscription, payment, checkPayment, amount_due} from "../../api.js";
import {useNavigate} from "react-router-dom";

export default function Payment() {
    const [loadingPlan, setLoadingPlan] = useState(null);
    const navigate = useNavigate();
    const [paymentData, setPaymentData] = useState({});
    const [isChange, setIsChange] = useState(true);
    const [doSwitch, setDoSwitch]  = useState(false);
    const [checkPay, setCheckPay] = useState(false);
    const [company, setCompany] = useState({});
    const [employeesLimit, setEmployeesLimit] = useState(paymentData.employee_limit ? paymentData.employee_limit : 1);
    const PRICING_PLANS = [
        {
            id: '1',
            name: 'Hobby',
            price: '$0',
            period: 'month',
            features: ['Up to 3 employees', 'Up to 100 customers', 'Basic features'],
            buttonText: 'Start Free Trial',
            isPopular: false,
        },
        {
            id: '2',
            name: 'Pro',
            price: `$${10*employeesLimit}`,
            period: 'month',
            features: ['Everything in Hobby', 'Advanced analytics', 'Priority email support', 'Exclusive masterclasses'],
            buttonText: 'Upgrade to Pro',
            isPopular: true,
        },
        {
            id: '3',
            name: 'Enterprise',
            price: `$${20*employeesLimit}`,
            period: 'month',
            features: ['Everything in Pro', 'Unlimited team members', 'Dedicated account manager', 'Custom API access'],
            buttonText: 'Contact Sales',
            isPopular: false,
        },
    ];

   const cancelSub = async () => {
        const res = confirm('Do you want to cancel the subscription?');
        if (res) {
         const data = {sub_id:paymentData.stripe_subscription_id,
          cancel_at_period_end:true, paymentId:paymentData.id, companyId: company?.id};
        const resCancel = await updateSubscription(data);
        console.log({resCancel});
        setIsChange((prev) => !prev)
        }
   }

    const reCancelSub = async () => {
        const res = confirm('Do you want to cancel the subscription?');
        if (res) {
            const data = {sub_id:paymentData.stripe_subscription_id,
            cancel_at_period_end:false, paymentId:paymentData.id, companyId: company?.id};
            const resReCancelSub = await updateSubscription(data);
            console.log({resReCancelSub});
            setIsChange((prev) => !prev)
        }
    }

    const amountDue = async (price) => {
        const [currency, ...pr] = price.split('');
       const result = await amount_due({subscription_id:paymentData.stripe_subscription_id, price:String(pr.join(''))});
       if(result.amount_due){
           const price_due = Number(Number(result.amount_due)/100).toFixed(2);
           const poll = confirm(`Price due will be $${price_due}. Do you agree with it ?`);
           if(poll){
               const data = {sub_id:paymentData.stripe_subscription_id,
               cancel_at_period_end:true, paymentId:paymentData.id, price:Number(pr.join('')), employee_limit:employeesLimit};
               const resCancel = await updateSubscription(data);
           }
       }
    }

    const handleSubscribe = async (planId, price) => {
        setLoadingPlan(planId);
        try {
            const [currency, ...pr] = price.split('');
            console.log({pr:Number(pr.join('')), currency});
            const data = await payment({companyId:company?.id, employeesLimit, price: Number(pr.join(''))});
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Failed to initiate payment. Please try again.');
                setLoadingPlan(null);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('A network error occurred.');
            setLoadingPlan(null);
        }
    };
    useEffect(() => {
        const result = JSON.parse(localStorage.getItem('company'));
        setCompany(result);
        (async () => {
            const payment = await checkPayment();
            if((payment || {}).payment_status?.id){
                setCheckPay(payment.payment_status.id !== 1);
                setPaymentData(payment);
            }else {
                setCheckPay(true);
            }
        })()
    }, [isChange]);
    return (
        <main className="pricing-container">
            <header className="pricing-header">
                <h1>{checkPay?'Choose Your Subscription Plan':'You already subscribed!'}</h1>
                <h1>Employees limit {employeesLimit}</h1>
                <p>Unlock premium features and scale your workflow with our flexible plans.</p>
                {!checkPay?<><p style={{paddingBottom:'15px'}}>If you want switch an other rate you can do it</p>
                <button onClick={() => setDoSwitch((prev) => !prev)}>Switch rate</button>
                </>:''}
            </header>
            {(checkPay || doSwitch) ? <div className="pricing-grid">
                {PRICING_PLANS.map((plan) => (
                    <section
                        key={plan.id}
                        className={`pricing-card ${plan.isPopular ? 'popular' : ''}`}
                    >
                        {plan.isPopular && <span className="badge">Most Popular</span>}
                        <h2 className="plan-name">{plan.name}</h2>
                        <div className="plan-price">
                            <span className="amount">{plan.price}</span>
                            <span className="period">/{plan.period}</span>
                        </div>
                        <ul className="features-list">
                            {plan.features.map((feature, idx) => (
                                <li key={idx}>
                                    <span className="check-icon">✓</span> {feature}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => setCheckPay?amountDue(plan.price):handleSubscribe(plan.id, plan.price)}
                            disabled={loadingPlan !== null || (plan.id === '1' && employeesLimit > 3)}
                            className={`subscribe-btn ${plan.isPopular ? 'btn-primary' : 'btn-secondary'}`}
                        >
                            {loadingPlan === plan.id ? 'Connecting...' : plan.buttonText}
                        </button>
                    </section>
                ))}
                <div className="employees-count-container">
                    <p>Change your employees limit</p>
                    <div className="employees-count-buttons">
                        <button
                            className="btn-secondary"
                            onClick={() => setEmployeesLimit(prev => prev - 1)}
                            disabled={employeesLimit <= 1}
                        >
                            −
                        </button>
                        <span>{employeesLimit}</span>
                        <button
                            className="btn-secondary"
                            onClick={() => setEmployeesLimit(prev => prev + 1)}
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>:''}
            {!checkPay ? !paymentData.cancel_at_period_end?<div style={{textAlign: 'center'}}><h1 style={{color: 'red', paddingBottom: '20px'}}>You already subscribed</h1>
                <button onClick={cancelSub}>Cancel subscribe</button>
            </div>:<div style={{textAlign: 'center'}}>
                <h1 style={{color: 'red', paddingBottom: '20px'}}>You already canceled subscribed to end subscribe {(new Date().getDate() - new Date().getDate()) > 0 ? `rest ${new Date().getDate() - new Date().getDate()} day`: 'end today'}</h1>
                <h2 style={{color: 'red', paddingBottom: '20px'}}>You can recancel your subscribe</h2>
                <button onClick={reCancelSub}>Recancel subscribe</button>
            </div>:''}
        </main>
    );
}
