import React from 'react';
import FormattedMessage from '@common/formattedMessage';

export default function Avatar({ data }) {
  const list = data || [];
  return (
    <div className="medals">
      <FormattedMessage id="user_medals" />
      {list.length === 0 ? (
        <FormattedMessage className="empty" id="user_medals_empty" />
      ) : (
        <span />
      )}
    </div>
  );
}
