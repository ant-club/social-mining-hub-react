import React, { useState, useEffect } from 'react';
import EzModal from '@common/ezModal';
import FormattedMessage from '@common/formattedMessage';
import I18n from '@models/i18n';
import User from '@models/user';
import { Form, Input, Button } from '@common/antd';
import ImageUploader from '@common/imageUploader';

export default function SubmitModal({ data, onSuccess, ...rest }) {
  const {
    submitUserSubMission,
  } = User.useContainer();
  const { t } = I18n.useContainer();

  const onFinish = (values) => {
    if (!data) return;
    submitUserSubMission(data.id, values).then(onSuccess);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

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

        <Form.Item className="submit-row">
          <Button type="primary" htmlType="submit" size="large">
            <FormattedMessage id="mission_submit_submit" />
          </Button>
        </Form.Item>
      </Form>
    </EzModal>
  );
}
