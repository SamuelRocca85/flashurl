import axios from "axios";
import { useState } from "react";

type HttpMethod = 'patch' | 'get' | 'post' | 'put' | 'delete'

type UseAxios<T> = {
    data: T | undefined
    loading: boolean
    error: any
    fetchResponse: (url: string, method?: HttpMethod, body?: any, onSuccess?: (data: T) => void, onError?: (error: any) => void) => Promise<void>
    setData: (data: T | ((prev: T) => T)) => void
}

const useAxios: <T>({ defaultValue }: { defaultValue: T }) => UseAxios<T> = <T>({ defaultValue }: { defaultValue: T }) => {
    axios.defaults.baseURL = import.meta.env.VITE_API_URL
    const [data, setData] = useState<T>(defaultValue)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>()

    const fetchResponse = async (url: string, method: HttpMethod = 'get', body?: any, onSuccess?: (data: T) => void, onError?: (error: any) => void) => {
        setLoading(true)
        console.log("Fetching " + import.meta.env.VITE_API_URL + url)
        try {
            const response = await axios({
                url,
                method,
                data: body,
            })
            console.log(response.data)
            setData(response.data)
            onSuccess?.(response.data)
        } catch (error) {
            setError(error)
            onError?.(error)
        } finally {
            setLoading(false)
        }
    }

    return { data, loading, error, fetchResponse, setData }
}

export default useAxios