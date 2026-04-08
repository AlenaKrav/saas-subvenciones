import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../config/msalConfig";
import '../App.css';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "./ui/card";
import darkLogo from '@/assets/Tramita square logo Dark Blue.svg'
import lightLogo from '@/assets/Tramita square logo White.svg'
import { useTheme } from "@/components/theme-provider"


export default function LoginPage() {
    const { instance, inProgress } = useMsal();
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const variant = theme ==="dark" ? "dark" : "brand";


    const handleLogin = async () => {
        try {
            await instance.loginRedirect(loginRequest);
        } catch (error) {
            console.error("Failed to log in:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-2">
            <Card className="border-none w-full max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.20)] p-8 flex flex-col items-center gap-6">
                <h1 className="text-4xl font-semibold text-(--brand-color) text-center"> Bienvenid@ a </h1>
                <CardContent className="flex justify-center">
                    <img src={isDark ? lightLogo : darkLogo} 
                    alt="TRAMITA" className="w-30 h-30 object-contain" />
                </CardContent>
                <Button
                    className="w-auto mt-2"
                    variant={variant}
                    size="xl"
                    onClick={handleLogin}
                    disabled={inProgress !== 'none'}>Introduce tus credenciales</Button>
            </Card>
        </div>
    )
}
