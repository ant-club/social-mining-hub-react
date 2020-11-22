import React from 'react';
import I18n from './i18n';
import Router from './router';
import Web3 from './web3v2';
import User from './user';
import Utils from './utils';

const models = {
  I18n,
  Router,
  Web3,
  User,
  Utils,
};


function compose(containers) {
  return function Component(props) {
    return containers.reduceRight((children, Container) => <Container.Provider>{children}</Container.Provider>, props.children);
  };
}

const ComposedStore = compose(Object.values(models));

function Store({ children }) {
  console.log('global contexts have been re-rendered at: ' + Date.now());

  return (
    <ComposedStore>
      {children}
    </ComposedStore>
  );
}

function connect(ms) {
  return function linkMap(mapStateToProps) {
    return function wrapComponent(Component) {
      return function ConnectComponet(props) {
        const state = mapStateToProps(ms.map(model => model.useContainer()));
        return (
          <Component {...props} {...state} />
        );
      };
    };
  };
}

export default React.memo(Store);
export {
  connect,
};
