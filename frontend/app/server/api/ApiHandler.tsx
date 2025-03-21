import axios from 'axios';

interface RiskResponse {
    daytime_heat_stress: number;
    nighttime_heat_stress: number;
    frost_stress: number;
    drought_index: number;
}

export interface RecommendationsResponse {
    detailed_description: string,
    simple_description: string,
    product: string
}

export const fetchRisks = async (lat: number, lon: number, crop: string): Promise<RiskResponse> => {
    const baseURL = "https://harvestguard-70re.onrender.com";
    axios.defaults.baseURL = baseURL;
    try {
        const response = await axios.get<RiskResponse>(baseURL + '/risks', {
            params: {
                lat,
                lon,
                crop,
            },
        });
        console.debug('Fetched risks:', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error('Error fetching risks:', error);
        throw error;
    }
};

export const fetchRecommendations = async (lat: number, lon: number, crop: string): Promise<RecommendationsResponse[]> => {
    try {
        const response = await axios.get<RecommendationsResponse[]>('/recommendations', {
            params: {
                lat,
                lon,
                crop,
            },
        });
        console.debug('Fetched recommendations:', JSON.stringify(response));
        return response.data;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
    }
};
// todo Nutient-, photphoros, yield stress, drought risk, temperature (day, night, frost)