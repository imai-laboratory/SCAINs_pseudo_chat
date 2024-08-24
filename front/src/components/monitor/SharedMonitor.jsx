import React from 'react';
import "../../assets/styles/SharedMonitor.css"
import {useTranslation} from "react-i18next";

function SharedMonitor({ image_A, image_B, image_user, image_missing_B, sharedImg, speaker, switchMissedImage }) {
    const imageUrl = switchMissedImage ? image_B : image_missing_B;
    const { t } = useTranslation();

    return (
        <div className="shared-monitor">
            <div className="left-images">
                <div className="md text-bold">{t('tasks.description')}</div>
                <img src={sharedImg} alt="A" className="left-image"/>
            </div>
            <div className="right-images">
            <div className="right-item">
                    <img src={image_user} alt="user" className={`right-image ${speaker === 'user' ? "speaker" : ""}`}/>
                    <div>{t('speakers.you')}</div>
                </div>
                <div className="right-item">
                    <img src={image_A} alt="A" className={`right-image ${speaker === 'A' ? "speaker" : ""}`}/>
                    <div>{t('speakers.A')}</div>
                </div>
                <div className="right-item">
                    <img src={imageUrl} alt="B" className={`right-image ${speaker === 'B' ? "speaker" : ""}`}/>
                    <div>{t('speakers.B')}</div>
                </div>
            </div>
        </div>
    );
}

export default SharedMonitor;
