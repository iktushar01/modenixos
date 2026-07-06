import Home from "@/components/modules/HomePage/Home";
import { DemoHealthBanner } from "@/components/modules/HomePage/DemoHealthBanner";

export default function HomePage() {
    return (
        <div>
            <DemoHealthBanner />
            <Home />
        </div>
    );
}