export async function getData(userId) {
    try {
        const res = await fetch(`http://localhost:3000/api/data/${userId}`);
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        const data = await res.json();
        return data.value;
    } catch (error) {
        return 0;
    }
}

export async function sendData(userId, newValue) {
    try {
        const res = await fetch('http://localhost:3000/api/data', {
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
        return data;
    } catch (error) {
        console.error("error: ", error.message);
    }
}

export function getUserId() {
    const STORAGE_KEY = 'user_id';

    let userId = localStorage.getItem(STORAGE_KEY);

    if (!userId) {
        userId = generateUniqueId();
        localStorage.setItem(STORAGE_KEY, userId);
    }

    return userId;
}

function generateUniqueId() {
    return crypto.randomUUID();
}


