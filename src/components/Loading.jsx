import React from 'react';
import '../componentCSS/Loading.css';

const Loading = () => {
    return (
        <div className="zoom-loading-container">
            <div className="zoom-loader">
                <div className="zoom-circle"></div>
                <div className="zoom-circle"></div>
                <div className="zoom-circle"></div>
                <div className="zoom-circle"></div>
            </div>
        </div>
    );
};

export default Loading;

