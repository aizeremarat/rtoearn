import React from 'react';

const Login = ({ connectWallet }) => {
    return (
        <div className="login-page">
            <h2>Login</h2>
            <button onClick={connectWallet}>Connect Wallet</button>
        </div>
    );
};

export default Login;
