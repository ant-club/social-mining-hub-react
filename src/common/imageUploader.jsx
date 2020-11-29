import React, { useState, useEffect } from 'react';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import I18n from '@models/i18n';
import User from '@models/user';
import message from '@utils/message';

import './imageUploader.scss';

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

export default function ImageUploader({ value, onChange }) {
  const [staticPath, setStaticPath] = useState('');
  const [uploading, setUploading] = useState(false);
  const {
    uploadAttachment,
  } = User.useContainer();
  const { t } = I18n.useContainer();

  const onImageUpload = (e) => {
    if (uploading) return;
    const { files } = e.target;
    if (files.length === 0) return;
    const file = files[0];
    if (file.size > MAX_AVATAR_SIZE) {
      message.error(t('image_uploader_e_max_size'));
      return;
    }
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error(t('image_uploader_e_type'));
      return;
    }
    setUploading(true);
    uploadAttachment(file).then((resp) => {
      onChange(resp.url);
      setUploading(false);
      setStaticPath(resp.staticPath);
    }).catch(() => {
      setUploading(false);
    });
  };

  const imgUrl = value;

  return (
    <div className="image-uploader">
      {imgUrl ? (
        <>
          <img src={staticPath + imgUrl} alt="" />
          <div className="mask" onClick={() => onChange(null)}>
            <DeleteOutlined />
          </div>
        </>
      ) : (
        <>
          <div className="plus-icon">
            <PlusOutlined />
            <input type="file" onChange={onImageUpload} />
          </div>
        </>
      )}
    </div>
  );
}
