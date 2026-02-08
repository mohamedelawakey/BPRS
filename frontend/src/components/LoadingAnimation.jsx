import { useEffect, useState } from 'react';
import './LoadingAnimation.css';

const loadingMessages = [
    "Searching through millions of books...",
    "Analyzing your query with AI...",
    "Finding the best matches...",
    "Ranking by relevance...",
    "Almost there..."
];

function LoadingAnimation() {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-container">
            <div className="loading-content">
                {/* Animated Book Stack */}
                <div className="book-animation">
                    <div className="book book-1">
                        <div className="book-spine"></div>
                        <div className="book-cover"></div>
                    </div>
                    <div className="book book-2">
                        <div className="book-spine"></div>
                        <div className="book-cover"></div>
                    </div>
                    <div className="book book-3">
                        <div className="book-spine"></div>
                        <div className="book-cover"></div>
                    </div>

                    {/* Sparkles */}
                    <div className="sparkle sparkle-1"></div>
                    <div className="sparkle sparkle-2"></div>
                    <div className="sparkle sparkle-3"></div>
                    <div className="sparkle sparkle-4"></div>
                </div>

                {/* Loading Ring */}
                <div className="loading-ring">
                    <div className="ring-segment"></div>
                    <div className="ring-segment"></div>
                    <div className="ring-segment"></div>
                </div>

                {/* Loading Text */}
                <div className="loading-text">
                    <p className="loading-message" key={messageIndex}>
                        {loadingMessages[messageIndex]}
                    </p>
                    <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoadingAnimation;
