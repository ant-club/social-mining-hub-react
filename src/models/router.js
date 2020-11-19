import { useState, useEffect } from 'react';
import $ from 'jquery';
import { useHistory, useLocation } from 'react-router-dom';
import { fastMatchPath } from '@utils';
import { createContainer } from 'unstated-next';

const defaultPathConfig = {
  header: {},
  sidebar: {},
  top: null,
  refresh: [],
};

const pathConfigs = {
  '/': {
    key: 'index',
    refresh: [],
    header: {
      active: 'saving',
    },
  },
  '/coin/detail/:tokenAddress': {
    key: 'coin_detail',
    refresh: [],
    header: {
      active: 'saving',
    },
  },
  '/portfolio': {
    key: 'portfolio',
    refresh: [],
    header: {
      active: 'portfolio',
    },
  },
  '/history': {
    key: 'history',
    refresh: [],
    header: {
      active: 'history',
    },
  },
  '/swap': {
    key: 'swap',
    refresh: [],
    header: {
      active: 'swap',
    },
  },
};

const defaultStates = {
  currentPageConfig: defaultPathConfig,
  isConnectWalletVisible: false,
};

function useRouter(customInitialStates = {}) {
  const initialStates = {
    ...defaultStates,
    ...customInitialStates,
  };
  const history = useHistory();
  const pageLocation = useLocation();
  const [isConnectWalletVisible, showConnectWallet] = useState(initialStates.isConnectWalletVisible);
  const [currentPageConfig, setCurrentPageConfig] = useState(initialStates.currentPageConfig);

  // 监听页面切换，替换页面配置
  useEffect(() => {
    const { pathname } = pageLocation;
    const c = Object.keys(pathConfigs).find(key => fastMatchPath(pathname, key));
    $(window).scrollTop(0);
    setCurrentPageConfig({ ...defaultPathConfig, ...(pathConfigs[c] || {}) });
  }, [pageLocation]);

  return {
    history,
    pageLocation,
    currentPageConfig,
    isConnectWalletVisible,
    showConnectWallet,
    goto: (goto) => {
      if (pageLocation.pathname === goto) return;
      history.push(goto);
    },
  };
}

const Router = createContainer(useRouter);

export default Router;
