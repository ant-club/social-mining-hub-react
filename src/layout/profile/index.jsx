import React, { useState, useEffect } from 'react';
import User from '@models/user';
import { Spin } from '@common/antd';
import { WalletOutlined } from '@ant-design/icons';
import Avatar from './avatar';
import DisplayName from './displayName';
import Medals from './medals';

import './style.scss';

export default function Profile() {
  const {
    userInfo,
  } = User.useContainer();

  const {
    avatar,
    address,
    displayName,
    medals,
  } = (userInfo || {});

  return (
    <div id="profile">
      {address ? (
        <>
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
        </>
      ) : (
        <div className="no-data">
          <Spin />
        </div>
      )}
    </div>
  );
}
