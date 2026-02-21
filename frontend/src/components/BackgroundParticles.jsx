import { memo } from 'react';
import './BackgroundParticles.css';

function BackgroundParticles() {
    return (
        <div className="elegant-background">
            <div className="bg-orb orb-1"></div>
            <div className="bg-orb orb-2"></div>
            <div className="bg-orb orb-3"></div>
            <div className="bg-grid"></div>
        </div>
    );
}

export default memo(BackgroundParticles);
