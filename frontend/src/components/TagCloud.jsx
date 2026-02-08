import React, { useEffect, useRef } from 'react';
import TagCloud from 'TagCloud';
import './TagCloud.css';

const TagCloudComponent = () => {
    const containerRef = useRef(null);
    // Ensure we consistently use the SAME ref for cleanup to prevent double-render issues
    const instanceRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear any existing content to prevent duplication
        containerRef.current.innerHTML = '';

        const texts = [
            'Python', 'Java', 'JavaScript', 'C++',
            'React', 'Node.js', 'System Design', 'Algorithms',
            'Clean Code', 'Machine Learning', 'AI', 'Data Structures',
            'Docker', 'Kubernetes', 'AWS', 'Rust', 'Go',
            'TypeScript', 'SQL', 'NoSQL', 'Git'
        ];

        const options = {
            radius: 300,
            maxSpeed: 'normal',
            initSpeed: 'normal',
            direction: 135,
            keep: true,
            useContainerInlineStyles: false, // We control styles with CSS
            useItemInlineStyles: true, // Allow library to position items
        };

        // Initialize TagCloud
        try {
            instanceRef.current = TagCloud(containerRef.current, texts, options);
        } catch (e) {
            console.error("TagCloud init error:", e);
        }

        // Capture the ref value for cleanup
        const container = containerRef.current;

        return () => {
            if (instanceRef.current) {
                try {
                    instanceRef.current.destroy();
                } catch (e) { /* ignore cleanup errors */ }
                instanceRef.current = null;
            }
            if (container) {
                container.innerHTML = '';
            }
        };
    }, []); // Run once on mount

    return (
        <div className="tag-cloud-wrapper">
            <span className="tag-cloud-container" ref={containerRef}></span>
        </div>
    );
};

export default TagCloudComponent;
