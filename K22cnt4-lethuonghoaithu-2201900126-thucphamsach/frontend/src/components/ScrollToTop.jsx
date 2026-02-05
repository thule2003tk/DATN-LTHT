import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname, search, key } = useLocation();
    const navType = useNavigationType();

    useEffect(() => {
        // Enforce manual scroll restoration
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    // Save scroll position for the current navigation key
    useEffect(() => {
        const handleScroll = () => {
            sessionStorage.setItem(`scroll_${key}`, window.scrollY.toString());
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [key]);

    useEffect(() => {
        if (navType !== "POP") {
            window.scrollTo(0, 0);
        } else {
            const savedPos = sessionStorage.getItem(`scroll_${key}`);

            if (savedPos) {
                const targetY = parseInt(savedPos);
                let attempts = 0;
                const maxAttempts = 15; // Try for ~1.5 seconds

                const restoreScroll = () => {
                    window.scrollTo(0, targetY);
                    attempts++;

                    // If we haven't reached the target (page might still be loading/short)
                    // Keep trying until height is sufficient or we timeout
                    if (Math.abs(window.scrollY - targetY) > 2 && attempts < maxAttempts) {
                        setTimeout(restoreScroll, 100);
                    }
                };

                restoreScroll();
            }
        }
    }, [pathname, search, navType, key]);

    return null;
}
