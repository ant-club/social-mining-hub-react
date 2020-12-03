/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useCallback } from 'react';
import User from '@models/user';
import { Spin } from '@common/antd';
import Form from './form';
import Timeline from './timeline';

import './style.scss';

function Index() {
  const {
    userInfo,
  } = User.useContainer();

  const {
    address,
  } = (userInfo || {});

  return (
    <div id="index">
      {address ? (
        <div className="content">
          <Form data={userInfo || {}} />
          <Timeline userInfo={userInfo || {}} />
        </div>
      ) : (
        <div className="no-data">
          <Spin />
        </div>
      )}
    </div>
  );
}


export default Index;
