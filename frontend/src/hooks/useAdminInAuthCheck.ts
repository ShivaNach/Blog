import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    username: string;
    role: string;
    exp: number;
}


export const useAdminInAuthCheck = () => {

    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [loading, setLoading] = useState(false);
    let adminUsername: string | null = null; 
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/admin");
            return;
        }

        try {
            const decoded: DecodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            adminUsername = decoded.username;
            if (decoded.exp < currentTime || decoded.role !== "admin") {
                localStorage.removeItem("token");
                router.replace("/admin");
                return;
            }
        } catch (err) {
            console.error("Invalid token", err);
            localStorage.removeItem("token");
            router.replace("/admin");
            return;
        }

        setCheckingAuth(false);
    }, [router]);

    return { checkingAuth, loading, setLoading, adminUsername };
}