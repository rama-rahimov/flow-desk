import {useState} from 'react';
import './Payment.css';
import {updateSubscription, payment} from "../../api.js";
import {useLocation} from "react-router-dom";

export default function Payment() {
    const [loadingPlan, setLoadingPlan] = useState(null);
    const location = useLocation();
    const [paymentData] = useState(location.state.paymentData);
    const [checkPay] = useState(location.state.checkPay);
    const [companyId] = useState(location.state.companyId);
    const [employeesCount, setEmployeesCount] = useState(1);
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
            price: `$${10*employeesCount}`,
            period: 'month',
            features: ['Everything in Hobby', 'Advanced analytics', 'Priority email support', 'Exclusive masterclasses'],
            buttonText: 'Upgrade to Pro',
            isPopular: true,
        },
        {
            id: '3',
            name: 'Enterprise',
            price: `$${20*employeesCount}`,
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
          cancel_at_period_end:true, paymentId:paymentData.id, companyId};
        const resCancel = await updateSubscription(data);
        console.log({resCancel});
        }
    }

    const handleSubscribe = async (planId, price) => {
        setLoadingPlan(planId);
        try {
            const [currency, ...pr] = price.split('');
            console.log({pr:Number(pr.join('')), currency});
            const data = await payment({companyId, employeesCount, price: Number(pr.join(''))});
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
    return (
        <main className="pricing-container">
            <header className="pricing-header">
                 <h1>{checkPay?'Choose Your Subscription Plan':'You already subscribed!'}</h1>
                <h1>Employees limit {employeesCount}</h1>
                <p>Unlock premium features and scale your workflow with our flexible plans.</p>
            </header>
            <div className="pricing-grid">
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
                            onClick={() => handleSubscribe(plan.id, plan.price)}
                            disabled={loadingPlan !== null || (plan.id === '1' && employeesCount > 3) }
                            className={`subscribe-btn ${plan.isPopular ? 'btn-primary' : 'btn-secondary'}`}
                        >
                            {loadingPlan === plan.id ? 'Connecting...' : plan.buttonText}
                        </button>
                    </section>
                ))}
                <div className="employees-count-container">
                    <p>Change your employees count</p>
                    <div className="employees-count-buttons">
                        <button
                            className="btn-secondary"
                            onClick={() => setEmployeesCount(prev => prev - 1)}
                            disabled={employeesCount <= 1}
                        >
                            −
                        </button>
                        <span>{employeesCount}</span>
                        <button
                            className="btn-secondary"
                            onClick={() => setEmployeesCount(prev => prev + 1)}
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
            <h1 style={{color:'red', textAlign:'center'}}>You already subscribed</h1>
            <button style={{textAlign:'center'}} onClick={cancelSub}>Cancel subscribed</button>
        </main>
    );
}
