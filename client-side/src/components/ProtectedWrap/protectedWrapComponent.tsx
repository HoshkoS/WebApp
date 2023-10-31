import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedWrap(props: { children: JSX.Element }) {
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("jwtToken") == null) {
            navigate("/login");
        }
    });

    return (
        <>
            {props.children}
        </>
    )
}