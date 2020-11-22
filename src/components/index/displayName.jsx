import React, { useState } from 'react';
import classnames from 'classnames';
import I18n from '@models/i18n';
import User from '@models/user';
import message from '@utils/message';

const MAX_NAME_SIZE = 100;

export default function DisplayName({ name }) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');

  const {
    updateUserInfo,
  } = User.useContainer();
  const { t } = I18n.useContainer();

  const onNameChange = (e) => {
    const { value } = e.target;
    if (value.length > MAX_NAME_SIZE) {
      message.error(t('user_e_name_max_size'));
      return;
    }
    setEditing(false);
    if (!value || value === name) return;
    updateUserInfo({
      displayName: value,
    });
  };

  const onNameClick = () => {
    setEditing(true);
    setNewName(name || '');
  };

  const displayName = name || t('user_no_name');

  return (
    <div className={classnames('displayname', { editing })}>
      {editing ? (
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onBlur={onNameChange}
          placeholder={t('user_name_placeholder')}
        />
      ) : (
        <span className="name" onClick={onNameClick}>{displayName}</span>
      )}
    </div>
  );
}
