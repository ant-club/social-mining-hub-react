import React from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { UploadOutlined } from '@ant-design/icons';
import I18n from '@models/i18n';
import User from '@models/user';
import message from '@utils/message';

const MAX_AVATAR_SIZE = 1024 * 1024;

export default function Avatar({ url, address }) {
  const {
    updateUserAvatar,
  } = User.useContainer();
  const { t } = I18n.useContainer();

  const onAvatarUpload = (e) => {
    const { files } = e.target;
    if (files.length === 0) return;
    const file = files[0];
    if (file.size > MAX_AVATAR_SIZE) {
      message.error(t('user_e_avatar_max_size'));
      return;
    }
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error(t('user_e_avatar_type'));
      return;
    }
    updateUserAvatar(file);
  };

  const avatarImg = url ? <img src={url} /> : <Jazzicon seed={jsNumberForAddress(address)} diameter={95} />;

  return (
    <div className="avatar">
      {avatarImg}
      <div className="mask">
        <UploadOutlined />
        <input type="file" onChange={onAvatarUpload} />
      </div>
    </div>
  );
}
