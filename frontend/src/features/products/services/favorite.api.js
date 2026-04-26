import axios from "axios";

const API_URL = "/api/favorites";

export const toggleFavorite = async (productId) => {
    const { data } = await axios.post(`${API_URL}/toggle/${productId}`);
    return data;
};

export const getFavorites = async () => {
    const { data } = await axios.get(API_URL);
    return data;
};
