let API_URL = import.meta.env.VITE_API_URL;

const BASE_URL = API_URL.replace('/api', '');
export const imageUrl = (filename: string) => `${BASE_URL}/images/${filename}`;

export default API_URL;