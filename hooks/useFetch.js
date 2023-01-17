export default class useFetch {
    constructor(hostname) {
        this.hostname = hostname;
    }

    async get(endpoint) {
        const res = await fetch(this.hostname + endpoint);
        return await res.json();
    }

    async post(endpoint, data) {
        const res = await fetch(this.hostname + endpoint, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });
        return await res.json();
    }

    async delete(endpoint, id) {
        const res = await fetch(this.hostname + endpoint + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return await res.json();
    }
}
