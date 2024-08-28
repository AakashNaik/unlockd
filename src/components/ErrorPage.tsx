import React from 'react';

export function ErrorPage() {
  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-artwork">
          <svg className="error-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56Z" fill="#FFD1DC"/>
            <path d="M32 48C40.8366 48 48 40.8366 48 32C48 23.1634 40.8366 16 32 16C23.1634 16 16 23.1634 16 32C16 40.8366 23.1634 48 32 48Z" fill="#FFA5B9"/>
            <path d="M26 36C27.6569 36 29 34.6569 29 33C29 31.3431 27.6569 30 26 30C24.3431 30 23 31.3431 23 33C23 34.6569 24.3431 36 26 36Z" fill="#7D6167"/>
            <path d="M38 36C39.6569 36 41 34.6569 41 33C41 31.3431 39.6569 30 38 30C36.3431 30 35 31.3431 35 33C35 34.6569 36.3431 36 38 36Z" fill="#7D6167"/>
            <path d="M32 42C34.7614 42 37 40.7614 37 39C37 37.2386 34.7614 36 32 36C29.2386 36 27 37.2386 27 39C27 40.7614 29.2386 42 32 42Z" fill="#7D6167"/>
          </svg>
        </div>
        <h1>Whoops! <span className="highlight">Looks like we hit a snag</span></h1>
        <p>Don't worry, it's not you - it's us! We're working on getting things back to normal. How about we give it another shot?</p>
        <button onClick={() => window.location.reload()} className="refresh-button">
          Let's Try Again
        </button>
      </div>
    </div>
  );
}