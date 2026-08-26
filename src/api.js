const API_URL = 'http://localhost:3000';

export async function register(userData) {
    const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    return response.json();
}

export async function login_employment(userData) {
    const response = await fetch(`${API_URL}/api/login_employment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    return response.json();
}

export async function login(userData) {
    const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    return response.json();
}

export async function payment(data) {
    const response = await fetch(`${API_URL}/api/payments/create-checkout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    return response.json();
}

export async function checkCompany(link) {
    const response = await fetch(`${API_URL}/api/company/${link}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return response.json();
}