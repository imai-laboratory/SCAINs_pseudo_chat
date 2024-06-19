import React from 'react';

function Monitor({ image_A, image_B, image_user, image_missing_B, isMissedListener, switchMissedImage }) {
    const imageUrl = switchMissedImage ? image_B : image_missing_B;

    return (
        <div className="monitor-frame">
            <div className="a-person">
                <img src={image_A} alt={"A"} className="a-person-img"/>
                <div>Aさん</div>
            </div>
            {isMissedListener ?
                <div className="a-person">
                    <img src={image_user} alt="user" className="a-person-img"/>
                    <div>userさん</div>
                </div> :
                <div className="a-person">
                    <img src={imageUrl} alt="B" className="a-person-img"/>
                    <div>Bさん</div>
                </div>
            }
        </div>
    );
}

export default Monitor;
