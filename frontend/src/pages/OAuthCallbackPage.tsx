import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/slices/AuthSlice";
import toast from "react-hot-toast";

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const token = params.get("token");
    const userParam = params.get("user");

    if (!token || !userParam) {
      navigate("/sign-in");
      return;
    }

    const user = JSON.parse(decodeURIComponent(userParam));

    dispatch(
      setAuth({
        access_token: token,
        user,
      }),
    );

    localStorage.setItem("access_token", token);
    localStorage.setItem("user", JSON.stringify(user));

    toast.success("Logged in!", {
      position: "top-right",
    });

    navigate("/dashboard", { replace: true });
  }, []);

  return <p>Signing you in...</p>;
}
