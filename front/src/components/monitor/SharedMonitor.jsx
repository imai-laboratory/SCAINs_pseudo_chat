import React from 'react';
import "../../assets/styles/SharedMonitor.css"

function SharedMonitor({ image_A, image_B, image_user, image_missing_B, sharedImg, speaker, switchMissedImage }) {
    const imageUrl = switchMissedImage ? image_B : image_missing_B;

    return (
        <div className="shared-monitor">
            <div className="left-images">
                <img src={sharedImg} alt="A" className="left-image"/>
            </div>
            <div className="right-images">
                <div className="right-item">
                    <img src={image_user} alt="user" className={`right-image ${speaker === 'user' ? "speaker" : ""}`}/>
                    <div>あなた</div>
                </div>
                <div className="right-item">
                    <img src={image_A} alt="A" className={`right-image ${speaker === 'A' ? "speaker" : ""}`}/>
                    <div>Aさん</div>
                </div>
                <div className="right-item">
                    <img src={imageUrl} alt="B" className={`right-image ${speaker === 'B' ? "speaker" : ""}`}/>
                    <div>Bさん</div>
                </div>
            </div>
        </div>
    );
}

export default SharedMonitor;
