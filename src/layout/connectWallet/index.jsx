import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import FormattedMessage from '@common/formattedMessage';
import ASSETS from '@common/assets';
import Web3 from '@models/web3v2';
import Router from '@models/router';
import User from '@models/user';
import { Spin } from '@common/antd';
import EzModal from '@common/ezModal';
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
  const {
    getUserInfo,
  } = User.useContainer();

  const handleLogin = (provider) => {
    setSubmittion(true);
    init(provider)
      .then(connect)
      .then(([newCurrentAccount]) => login(newCurrentAccount))
      .then((logined) => {
        if (!logined) {
          return;
        }
        getUserInfo().then(() => {
          setSubmittion(false);
        });
      });
  };

  const show = !currentAccount || isConnectWalletVisible || submiting;

  return (
    <EzModal visible={show} closable={false} className={classnames('connect-wallet-modal', { submiting })} width="">
      {submiting ? (
        <Spin />
      ) : (
        <>
          <div className="title"><FormattedMessage id="connectwallet_title" /></div>
          <div className="wallet" onClick={() => handleLogin('metamask')}>
            <img src={ASSETS.walletMetamask} alt="" />
            <span>Metamask</span>
          </div>
          <div className="wallet disabled">
            <img src={ASSETS.walletWalletconnect} alt="" />
            <span>Wallet Connect</span>
          </div>
        </>
      )}
    </EzModal>
  );
}
