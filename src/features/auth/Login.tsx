import { FormEvent, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLoginMutation } from "./authApiSlice"
import { useDispatch } from "react-redux"
import { setCredentials } from "./authSlice"

const Login = () => {

    const userRef = useRef<HTMLInputElement>(null)
    const errRef = useRef<HTMLInputElement>(null)
    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const navigate = useNavigate()


    const [login, { isLoading }] = useLoginMutation()
    const dispatch = useDispatch()

    useEffect(() => {
        userRef.current?.focus()
    }, []);

    useEffect(() => {
        setErrMsg('')
    }, [user, pwd])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try{
            const userData = await login({ user, pwd }).unwrap()
            dispatch(setCredentials({ ...userData, user}))
            setUser('')
            setPwd('')
            navigate('/welcome')

        } catch(err){
            interface ErrorResponse{
                response?:{
                    status?:number
                }
            }
            const error = err as ErrorResponse
            if(!error?.response){
                setErrMsg('No server response');
            } else if(error.response?.status === 400){
                setErrMsg('Missing username or password');
            } else if(error.response?.status === 401){
                setErrMsg('Unathorized');
            } else {
                setErrMsg('Login failed')
            }
            errRef.current?.focus();

        }
    }

    const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => setUser(e.target.value)

    const handlePwdInput = (e: React.ChangeEvent<HTMLInputElement>) => setPwd(e.target.value)

    const content = isLoading ? <h1>Loading...</h1> : (
        <section className="login">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

            <h1>Employee Login</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    value={user}
                    onChange={handleUserInput}
                    autoComplete="off"
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={handlePwdInput}
                    value={pwd}
                    required
                />
                <button>Sign In</button>
            </form>
        </section>
    )


    return content

}

export default Login