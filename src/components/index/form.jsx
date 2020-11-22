import React, { useState, useEffect } from 'react';
import { Input, Select, Button } from '@common/antd';
import FormattedMessage from '@common/formattedMessage';
import I18n from '@models/i18n';
import Utils from '@models/utils';
import User from '@models/user';
import message from '@utils/message';

// provider
import Facebook from './socialAccounts/facebook';
import Medium from './socialAccounts/medium';
import Github from './socialAccounts/github';
import Google from './socialAccounts/google';
import Telegram from './socialAccounts/telegram';

const EMAIL_REG = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

let updateUserInfoHandler;
function ListenMessage(event) {
  if (event.data && event.data.sign === 'social-mining') {
    message[event.data.type](window.i18n[`message_${event.data.event}`]);
    if (updateUserInfoHandler) updateUserInfoHandler();
  }
}

export default function Form({ data }) {
  const {
    email,
    stateCode,
    language,
    description,
    socialAccounts,
  } = data;
  const {
    facebook,
    medium,
    github,
    google,
    telegram,
  } = (socialAccounts || {});
  const [newEmail, setNewEmail] = useState(email);
  const [states, setStates] = useState([]);
  const [newStateCode, setStateCode] = useState(stateCode);
  const [newLanguage, setNewLanguage] = useState(language);
  const [newDescription, setNewDescription] = useState(description);
  const {
    getStateCode,
  } = Utils.useContainer();
  const {
    updateUserInfo,
  } = User.useContainer();
  const { t } = I18n.useContainer();

  useEffect(() => {
    getStateCode().then(setStates);
  }, []);

  // 绑定社交账户跨页面传参
  useEffect(() => {
    window.addEventListener('message', ListenMessage, false);
    return () => {
      window.removeEventListener('message', ListenMessage);
    };
  }, []);

  useEffect(() => {
    updateUserInfoHandler = updateUserInfo;
  }, [updateUserInfo]);

  const checkBeforeSubmit = () => {
    if (!newEmail || !EMAIL_REG.test(newEmail)) {
      message.error(t('user_e_email_format'));
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!checkBeforeSubmit()) return;
    const payload = {
      email: newEmail,
      stateCode: newStateCode,
      language: newLanguage,
      description: newDescription,
    };
    updateUserInfo(payload).then(() => message.success(t('success')));
  };

  return (
    <div className="form">
      <div className="form-item">
        <div className="label"><FormattedMessage id="user_email" /></div>
        <div className="input"><Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder={t('user_email_placeholder')} /></div>
      </div>
      <div className="form-item">
        <div className="label"><FormattedMessage id="user_state" /></div>
        <div className="input">
          <Select value={newStateCode} onChange={setStateCode} placeholder={t('user_state_placeholder')}>
            {states.map(state => (
              <Select.Option key={state.code2} value={state.code2}>{state.state}</Select.Option>
            ))}
          </Select>
        </div>
      </div>
      <div className="form-item">
        <div className="label"><FormattedMessage id="user_language" /></div>
        <div className="input">
          <Select value={newLanguage} onChange={setNewLanguage} placeholder={t('user_language_placeholder')}>
            <Select.Option value="zh-cn">中文</Select.Option>
            <Select.Option value="en">English</Select.Option>
            <Select.Option value="jp">日本語</Select.Option>
            <Select.Option value="kr">한국어</Select.Option>
            <Select.Option value="ru">русский</Select.Option>
          </Select>
        </div>
      </div>
      <div className="form-item">
        <div className="label"><FormattedMessage id="user_description" /></div>
        <div className="input"><Input.TextArea rows={4} value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder={t('user_description_placeholder')} /></div>
      </div>
      <div className="form-item">
        <div className="label"><FormattedMessage id="user_facebook" /></div>
        <div className="input"><Facebook data={facebook} /></div>
      </div>
      <div className="form-item">
        <div className="label"><FormattedMessage id="user_medium" /></div>
        <div className="input"><Medium data={medium} /></div>
      </div>
      <div className="form-item">
        <div className="label"><FormattedMessage id="user_github" /></div>
        <div className="input"><Github data={github} /></div>
      </div>
      <div className="form-item">
        <div className="label"><FormattedMessage id="user_google" /></div>
        <div className="input"><Google data={google} /></div>
      </div>
      <div className="form-item">
        <div className="label"><FormattedMessage id="user_telegram" /></div>
        <div className="input"><Telegram data={telegram} /></div>
      </div>
      <div className="form-item submit">
        <Button type="primary" onClick={handleSubmit}><FormattedMessage id="user_info_submit" /></Button>
      </div>
    </div>
  );
}
