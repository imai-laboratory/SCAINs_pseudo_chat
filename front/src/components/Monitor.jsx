import React from 'react';

function Monitor({ image_A, image_B, image_user, image_missing_B, switchMissedImage }) {
    const imageUrl = switchMissedImage ? image_B : image_missing_B;

    return (
        <div className="monitor-frames">
            <div className="upper-frames">
                <div className="a-person">
                    <img src={image_A} alt={"A"} className="a-person-img"/>
                    <div>Aさん</div>
                </div>
                <div className="a-person">
                    <img src={image_user} alt="user" className="a-person-img"/>
                    <div>あなた</div>
                </div>
            </div>
            <div className="lower-frames">
                <div className="a-person">
                    <img src={imageUrl} alt="B" className="a-person-img"/>
                    <div>Bさん</div>
                </div>
            </div>
        </div>
    );
}

export default Monitor;
