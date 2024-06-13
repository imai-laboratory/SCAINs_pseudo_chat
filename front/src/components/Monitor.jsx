import React from 'react';

function Monitor({ image_A, image_B, image_user, image_missing_B, isMissedListener, switchMissedImage }) {
    const imageUrl = switchMissedImage ? image_B : image_missing_B;

    return (
        <div>
            <div className="a-person">
                <img src={image_A} alt={"A"} style={{width: '267px', height: '150px'}}/>
                <div>Aさん</div>
            </div>
            {isMissedListener ?
                <div className="a-person">
                    <img src={image_user} alt="user" style={{width: '267px', height: '150px'}}/>
                    <div>userさん</div>
                </div> :
                <div className="a-person">
                    <img src={imageUrl} alt="B" style={{width: '267px', height: '150px'}}/>
                    <div>Bさん</div>
                </div>
            }
        </div>
    );
}

export default Monitor;
