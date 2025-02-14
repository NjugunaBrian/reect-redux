import allowedOrigins from "./allowedOrigins"

interface CorsCallback {
    (error: Error | null, allow?: boolean): void;
}

interface CorsOptions {
    origin: (origin: string | undefined, callback: CorsCallback) => void;
    optionSuccessStatus: number;
}

const corsOptions: CorsOptions = {
    origin: (origin: string | undefined, callback: CorsCallback) => {
        if(!origin || allowedOrigins.includes(origin)){
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionSuccessStatus: 200
}

export default corsOptions
