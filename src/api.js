const API_URL = 'http://localhost:3000';
const test_prod_url = 'https://flow-desk-6trh.onrender.com';

export async function register(userData) {
    const response = await fetch(`${test_prod_url}/api/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    return response.json();
}

export async function login_employment(userData) {
    const response = await fetch(`${test_prod_url}/api/login_employment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.data);
        return data;
    }else {
        return response.json();
    }
}

export async function login(userData) {
    const response = await fetch(`${test_prod_url}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.data);
        return data;
    }else {
        return response.json();
    }
}

export async function payment(data) {
    const response = await fetch(`${test_prod_url}/api/payments/create-checkout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    return response.json();
}

export async function checkCompany(link) {
    const response = await fetch(`${test_prod_url}/api/company/${link}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return response.json();
}

export async function findProducts(id) {
    const response = await fetch(`${test_prod_url}/api/product/all/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return response.json();
}
export async function addProduct(data) {
    const response = await fetch(`${test_prod_url}/api/product/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    return response.json();
}

export async function editProduct(data) {
    const response = await fetch(`${test_prod_url}/api/product/edit`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    return response.json();
}

export async function deleteProduct(id) {
    const response = await fetch(`${test_prod_url}/api/product/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return response.json();
}

export async function currentUser() {
    const response = await fetch(`${test_prod_url}/api/user/profile/current`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' +   localStorage.getItem('token'),
        }
    });

    return response.json();
}

export async function editProfile(data) {
    const response = await fetch(`${test_prod_url}/api/user/profile/edit`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' +   localStorage.getItem('token'),
        },
        body: JSON.stringify(data)
    });

    return response.json();
}

export async function uploadFileAvatar(file) {
    const formData = new FormData();
    formData.append('file', file)
    formData.append('type', 'avatar');
    const response = await fetch(`${test_prod_url}/api/file/upload`, {
        method: 'POST',
        headers: {
           'Authorization': 'Bearer ' +   localStorage.getItem('token'),
        }, body: formData
    });
    return response.json();
}

export async function getEmployees() {
    const response = await fetch(`${test_prod_url}/api/user/employees`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' +   localStorage.getItem('token'),
        }
    });
    return response.json();
}

export async function addEmployees(data) {
    const response = await fetch(`${test_prod_url}/api/user/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' +   localStorage.getItem('token'),
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

export async function deleteEmployee(userId) {
    const response = await fetch(`${test_prod_url}/api/user/employee/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' +   localStorage.getItem('token'),
        }
    });
    return response.json();
}