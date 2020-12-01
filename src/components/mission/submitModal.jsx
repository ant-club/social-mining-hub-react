/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useEffect } from 'react';
import EzModal from '@common/ezModal';
import FormattedMessage from '@common/formattedMessage';
import I18n from '@models/i18n';
import User from '@models/user';
import Router from '@models/router';
import { Form, Input, Button, Alert } from '@common/antd';
import ImageUploader from '@common/imageUploader';

function getSocialAccountLink(userInfo, subMission) {
  if (!userInfo || !subMission) return null;
  const {
    provider,
  } = subMission;
  const {
    socialAccounts,
  } = userInfo;
  const account = socialAccounts[provider];
  if (!account) return null;
  const {
    displayName,
    profileUrl,
  } = account;
  if (profileUrl) {
    return (
      <a href={profileUrl} target="_blank">{displayName}</a>
    );
  }
  return <span>{displayName}</span>;
}

export default function SubmitModal({ data, onSuccess, ...rest }) {
  const {
    userInfo,
    submitUserSubMission,
  } = User.useContainer();
  const { t } = I18n.useContainer();
  const { goto } = Router.useContainer();

  const onFinish = (values) => {
    if (!data) return;
    submitUserSubMission(data.id, values).then(onSuccess);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleGotoUserPage = () => {
    goto('/');
    rest.onCancel();
  };

  const socialAccount = getSocialAccountLink(userInfo, data);
  return (
    <EzModal {...rest} title={<FormattedMessage id="mission_submit_title" />} className="mission-submit-modal">
      {data && (
        <div className="info">
          {data.title}
        </div>
      )}
      <Form
        layout="vertical"
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label={<FormattedMessage id="mission_submit_link" />}
          name="link"
          rules={[{ required: true, message: t('mission_submit_link_tip') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<FormattedMessage id="mission_submit_image" />}
          name="image"
          rules={[{ required: true, message: t('mission_submit_image_tip') }]}
        >
          <ImageUploader />
        </Form.Item>

        <Form.Item>
          {socialAccount ? (
            <Alert
              message={(
                <>
                  <FormattedMessage id="mission_submit_social_tip_1_1" data={{ provider: (data || {}).provider }} />
                  {socialAccount}
                  <FormattedMessage id="mission_submit_social_tip_1_2" />
                </>
              )}
              type="warning"
              showIcon
            />
          ) : (
            <Alert
              message={(
                <>
                  <FormattedMessage id="mission_submit_social_tip_2_1" />
                  <a onClick={handleGotoUserPage}><FormattedMessage id="sidebar_menu_user" /></a>
                  <FormattedMessage id="mission_submit_social_tip_2_2" data={{ provider: (data || {}).provider }} />
                </>
              )}
              type="error"
              showIcon
            />
          )}
        </Form.Item>
        <Form.Item className="submit-row">
          <Button type="primary" htmlType="submit" size="large" disabled={!socialAccount}>
            <FormattedMessage id="mission_submit_submit" />
          </Button>
        </Form.Item>
      </Form>
    </EzModal>
  );
}
