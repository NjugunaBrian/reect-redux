import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setCredentials } from "../../features/auth/authSlice";
import { RootState } from "../store";


const baseQuery = fetchBaseQuery({
    //Where the backend REST API runs
    baseUrl: "http://localhost:4000", //change this when you go into production
    credentials: 'include', //so we'll send back our http only secure cookie. Cookie sends with every query
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState
        const token = state.auth.token
        if(token){
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
}) 

const baseQueryWithReauth = async(args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
    let result = await baseQuery(args, api, extraOptions)

    if(result?.error?.status === 403){
        console.log('sending refresh token')
        //send refresh token to get new access token
        const refreshResult = await baseQuery('/refresh', api, extraOptions)
        console.log(refreshResult)
        if(refreshResult?.data){
            //const state = getState() as RootState
            const user  = (api.getState() as RootState).auth.user
            //store new token
            api.dispatch(setCredentials({ ...refreshResult.data, user }))
            //retry the original query with new access token
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logOut())
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: _builder => ({}),
});