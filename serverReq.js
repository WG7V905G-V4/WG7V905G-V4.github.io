const API_URL = 'https://game-server-xyz123.onrender.com';

export async function getData(userId) {
    try {
        const res = await fetch(`${API_URL}/api/data/${userId}`);
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        const data = await res.json();
        return data.value;
    } catch (error) {
        console.error('getData error:', error);
        return 0;
    }
}

export async function sendData(userId, newValue) {
    try {
        const res = await fetch(`${API_URL}/api/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: userId,
                value: newValue
            })
        });
        if (!res.ok) {
            throw new Error(res.statusText);
        }

        const data = await res.json();
        console.log('Data saved:', data);
        return data;
    } catch (error) {
        console.error("sendData error:", error.message);
    }
}

export function getUserId() {
    const STORAGE_KEY = 'user_id';

    let userId = localStorage.getItem(STORAGE_KEY);

    if (!userId) {
        userId = generateUniqueId();
        localStorage.setItem(STORAGE_KEY, userId);
        console.log('New user ID created:', userId);
    }

    return userId;
}

function generateUniqueId() {
    return crypto.randomUUID();
}
