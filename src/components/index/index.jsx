/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useCallback } from 'react';
import User from '@models/user';
import { Spin } from '@common/antd';
import Form from './form';

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
        <Form data={userInfo || {}} />
      ) : (
        <div className="no-data">
          <Spin />
        </div>
      )}
    </div>
  );
}


export default Index;
