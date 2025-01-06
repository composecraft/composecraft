import axios from "axios";

interface FetchComposeBookParams {
    search?: string | undefined;
    limit: number;
    page?: number
}

interface FetchComposeBookResponse {
    data: any[];
    meta: {
        total_count: number;
    };
}

export async function fetchComposeBooks(
    params: FetchComposeBookParams
): Promise<FetchComposeBookResponse> {
    if (!process.env.DIRECTUS_API_KEY) {
        throw new Error("Server error")
    }
    try {
        const response = await axios.get("https://directus.composecraft.com/items/compose_book", {
            headers: {
                Authorization: `Bearer ${process.env.DIRECTUS_API_KEY}`,
            },
            params: {
                search: params.search,
                sort: "-date_created",
                page: params.page || 0,
                limit: params.limit,
                meta: "total_count",
                fields: '*,tags.item.name'
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching compose books:", error);
        throw error;
    }
}


export async function fetchComposeBookById(id: string) {
    if (!process.env.DIRECTUS_API_KEY) {
        throw new Error("Server error")
    }
    const response = await axios.request({
        method: "SEARCH",
        baseURL: "https://directus.composecraft.com/items/compose_book",
        headers: {
            Authorization: `Bearer ${process.env.DIRECTUS_API_KEY}`,
        },
        data: {
            "query": {
                "filter": {
                    "id": {
                        "_eq": id
                    }
                },
                "fields" : [
                    "*,tags.item.name"
                ]
            }
        }
    });

    if (response.data.data.length === 0) {
        throw new Error("This compose does not exist anymore");
    }
    return response.data.data[0];
}