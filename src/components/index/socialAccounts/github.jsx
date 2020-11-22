/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Button } from '@common/antd';
import FormattedMessage from '@common/formattedMessage';

export default function GithubConnect({ data = {} }) {
  const {
    displayName,
    profileUrl,
  } = data;


  return (
    <div>
      {displayName ? (
        profileUrl ? (
          <a href={profileUrl} target="_blank">{displayName}</a>
        ) : (
          <span>{displayName}</span>
        )
      ) : (
        <a href="/auth/github" target="_blank">
          <Button type="primary"><FormattedMessage id="user_github_connect" /></Button>
        </a>
      )}
    </div>
  );
}
