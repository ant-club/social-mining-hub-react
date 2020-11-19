import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import FormattedMessage from '@common/formattedMessage';
import ASSETS from '@common/assets';
import Web3 from '@models/web3v2';
import Router from '@models/router';
import './style.scss';

export default function ConnectWallet() {
  const [submiting, setSubmittion] = useState(false);
  const {
    currentAccount,
    init,
    connect,
    login,
  } = Web3.useContainer();
  const {
    isConnectWalletVisible,
  } = Router.useContainer();

  const handleLogin = (provider) => {
    init(provider).then(connect).then(([newCurrentAccount]) => {
      login(newCurrentAccount);
    });
  };

  const show = !currentAccount || isConnectWalletVisible;
  return (
    <div id="connectwallet" className={classnames({ show })}>
      <div className="connectwallet-container">
        <div className="title"><FormattedMessage id="connectwallet_title" /></div>
        <div className="wallet" onClick={() => handleLogin('metamask')}>
          <img src={ASSETS.walletMetamask} alt="" />
          <span>Metamask</span>
        </div>
        <div className="wallet">
          <img src={ASSETS.walletWalletconnect} alt="" />
          <span>Wallet Connect</span>
        </div>
      </div>
    </div>
  );
}
