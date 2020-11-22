/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Button, Modal, Input } from '@common/antd';
import FormattedMessage from '@common/formattedMessage';
import ASSETS from '@common/assets';
import I18n from '@models/i18n';
import User from '@models/user';

export default function MediumConnect({ data = {} }) {
  const {
    displayName,
    profileUrl,
  } = data;
  const [modalVisible, showModal] = useState(false);
  const [token, setToken] = useState('');

  const {
    connectMedium,
  } = User.useContainer();
  const { t } = I18n.useContainer();

  const handleConnect = () => {
    if (!token) {
      return;
    }
    connectMedium(token);
    showModal(false);
  };

  return (
    <>
      <div>
        {displayName ? (
          profileUrl ? (
            <a href={profileUrl} target="_blank">{displayName}</a>
          ) : (
            <span>{displayName}</span>
          )
        ) : (
          <Button type="primary" onClick={() => showModal(true)}><FormattedMessage id="user_medium_connect" /></Button>
        )}
      </div>
      <Modal
        title={t('user_medium_connect')}
        visible={modalVisible}
        onCancel={() => showModal(false)}
        onOk={handleConnect}
        okButtonProps={{
          disabled: !token,
        }}
      >
        <div className="user-medium-modal">
          <div className="title"><FormattedMessage id="user_medium_nav" /></div>
          <div className="step">
            1. <FormattedMessage id="user_medium_nav_1" /><a href="https://medium.com/me/settings" target="_blank">Medium Setting</a>
          </div>
          <div className="step">
            2. <FormattedMessage id="user_medium_nav_2" />
          </div>
          <div>
            <img src={ASSETS.mediumNav} alt="" />
          </div>
          <div className="step">
            3. <FormattedMessage id="user_medium_nav_3" />
          </div>
          <div>
            <Input value={token} onChange={e => setToken(e.target.value)} placeholder={t('user_medium_token_placeholder')} />
          </div>
        </div>
      </Modal>
    </>
  );
}
