import React, { useEffect, useState } from 'react';
import './FestiveEffect.css';

const FestiveEffect = () => {
    const [petals, setPetals] = useState([]);

    useEffect(() => {
        const petalCount = 25;
        const newPetals = [];
        for (let i = 0; i < petalCount; i++) {
            newPetals.push({
                id: i,
                left: Math.random() * 100 + '%',
                size: Math.random() * 10 + 10 + 'px',
                delay: Math.random() * 10 + 's',
                duration: Math.random() * 10 + 10 + 's',
                type: Math.random() > 0.5 ? 'peach' : 'apricot'
            });
        }
        setPetals(newPetals);
    }, []);

    return (
        <>
            {/* Lớp nền cho cánh hoa rơi */}
            <div className="tet-bg-container">
                {petals.map(p => (
                    <div
                        key={p.id}
                        className={`petal ${p.type}`}
                        style={{
                            left: p.left,
                            width: p.size,
                            height: p.size,
                            animationDelay: p.delay,
                            animationDuration: p.duration
                        }}
                    />
                ))}
            </div>

            {/* Lớp trên cho lồng đèn */}
            <div className="tet-fg-container">
                <div className="festive-lantern lantern-left">
                    <div className="tassel"></div>
                </div>
                <div className="festive-lantern lantern-right">
                    <div className="tassel"></div>
                </div>
            </div>
        </>
    );
};

export default FestiveEffect;
