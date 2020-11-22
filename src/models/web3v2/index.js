/* eslint-disable prefer-promise-reject-errors */
import { useState, useEffect, useCallback, useRef } from 'react';
import { createContainer } from 'unstated-next';
import * as ethUtil from 'ethereumjs-util';
import { isEth } from '@utils';
import fetch from '@utils/fetch';
import initProvider from './providers';
import QUERYS from '../../querys';

const defaultStates = {
  isInited: false,
  web3: null,
  accounts: [],
  currentAccount: null,
};

const MAX_VAL = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

const getLoginTokenCallback = () => fetch.get(QUERYS.LOGIN_TOKEN());
const loginCallback = data => fetch.post(QUERYS.LOGIN, data);

function useWeb3(customInitialStates = {}) {
  const initialStates = {
    ...defaultStates,
    ...customInitialStates,
  };
  const [currentProvider, setCurrentProvider] = useState(null);
  const web3 = useRef(initialStates.web3);
  const [accounts, setAccounts] = useState(initialStates.accounts);
  const [currentAccount, setCurrentAccount] = useState(initialStates.currentAccount);
  const connectHandler = useRef(null);

  const updateAccounts = useCallback((web3instance) => {
    const instance = web3instance || web3.current;
    return instance.eth.getAccounts().then((as) => {
      setAccounts(as);
      return as;
    });
  }, [web3, accounts]);

  useEffect(() => {
    setCurrentAccount(accounts[0] || null);
  }, [accounts]);

  // provider event
  const onProviderConnet = useCallback(() => {
    console.log('wallet event: connect');
  }, []);
  const onProviderAccountsChanged = useCallback(() => {
    updateAccounts();
  }, [web3]);
  const onProviderChainChanged = useCallback(() => {
    console.log('wallet event: chainChanged');
  }, []);

  const initMetamask = useCallback(() => {
    if (currentProvider === 'metamask') return Promise.resolve();
    return initProvider('metamask').then(([web3Instance, connectMethod, handleConnect, handleAccountsChanged, handleChainChanged]) => {
      web3.current = web3Instance;
      connectHandler.current = connectMethod;
      handleConnect(onProviderConnet);
      handleAccountsChanged(onProviderAccountsChanged);
      handleChainChanged(onProviderChainChanged);
      setCurrentProvider('metamask');
    });
  }, [web3, updateAccounts, currentProvider]);

  const init = useCallback((provider) => {
    if (provider === 'metamask') {
      return initMetamask();
    }
    return Promise.reject({ code: -1 });
  }, [web3, currentProvider]);

  const connect = useCallback(() => {
    const handler = connectHandler.current;
    if (!handler) return Promise.reject({ code: -1 });
    return handler().then(() => updateAccounts());
  }, [connectHandler, updateAccounts, web3]);

  const login = useCallback(address => getLoginTokenCallback().then(({ message, nonce }) => {
    const token = message.replace('%nonce', nonce);
    if (!web3.current) return Promise.reject({ code: -1 });
    const web3Instance = web3.current;
    const msg = ethUtil.bufferToHex(Buffer.from(token, 'utf8'));
    const params = [msg, address];
    const method = 'personal_sign';
    return new Promise((resolve, reject) => {
      web3Instance.currentProvider.sendAsync({
        method,
        params,
        address,
      }, (err, result) => {
        if (err) {
          reject({ code: -1, err });
          return;
        }
        if (result.error) {
          reject({ code: -1, err: result.error });
          return;
        }

        const payload = {
          address,
          nonce,
          sig: result.result,
        };
        resolve(payload);
        // console.log('recovering...');
        // console.dir({ msgParams });
        // const recovered = sigUtil.recoverPersonalSignature(msgParams);
        // console.dir({ recovered });

        // if (recovered === from) {
        //   console.log('SigUtil Successfully verified signer as ' + from);
        //   window.alert('SigUtil Successfully verified signer as ' + from);
        // } else {
        //   console.dir(recovered);
        //   console.log('SigUtil Failed to verify signer when comparing ' + recovered.result + ' to ' + from);
        //   console.log('Failed, comparing %s to %s', recovered, from);
        // }
      });
    });
  }).then(
    loginCallback,
  ), [web3]);

  return {
    web3,
    accounts,
    currentAccount,
    currentProvider,
    init,
    connect,
    login,
  };
}

const Web3 = createContainer(useWeb3);

export default Web3;
