import axios from 'axios';

export const n8nApiClient = axios.create({
    baseURL: process.env.N8N_API_BASE_URL, // Ex: https://seu-n8n-url.com/api
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.N8N_API_TOKEN}`,
    },
});
