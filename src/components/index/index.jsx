/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useCallback } from 'react';
import User from '@models/user';
import I18n from '@models/i18n';
import { Spin } from '@common/antd';
import message from '@utils/message';
import { WalletOutlined } from '@ant-design/icons';
import Avatar from './avatar';
import DisplayName from './displayName';
import Medals from './medals';
import Form from './form';

import './style.scss';

function Index() {
  const {
    userInfo,
  } = User.useContainer();

  const {
    avatar,
    address,
    displayName,
    medals,
  } = (userInfo || {});
  const { t } = I18n.useContainer();

  return (
    <div id="index" className="site-page">
      {address ? (
        <>
          <div className="header">
            <div className="top">
              <Avatar url={avatar} address={address} />
              <div className="info">
                <DisplayName name={displayName} />
                <div className="address">
                  <WalletOutlined />
                  <span>{address}</span>
                </div>
              </div>
            </div>
            <Medals data={medals} />
          </div>
          <Form data={userInfo || {}} />
        </>
      ) : (
        <div className="no-data">
          <Spin />
        </div>
      )}
    </div>
  );
}


export default Index;
