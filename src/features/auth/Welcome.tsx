import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "./authSlice";
import { Link } from "react-router-dom";

const Welcome = () => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);

  const welcome = user ? `Welcome ${user}!` : "Welcome!";
  const tokenAbbr = `${token?.slice(0, 9)}...`;

  return (
    <>
      <section className="content">
        <h1>{welcome}</h1>
        <p>Token: {tokenAbbr}</p>
        <p><Link to="/userslist">Go to users list</Link></p>
      </section>
    </>
  );
};

export default Welcome;
