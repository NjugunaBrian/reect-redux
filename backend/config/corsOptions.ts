import allowedOrigins from "./allowedOrigins"

interface CorsCallback {
    (error: Error | null, allow?: boolean): void;
}

interface CorsOptions {
    origin: (origin: string | undefined, callback: CorsCallback) => void;
    credentials: boolean;
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
    credentials: true,
    optionSuccessStatus: 200,
}

export default corsOptions
