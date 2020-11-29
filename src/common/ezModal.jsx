import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { Modal } from './antd';
import './ezModal.scss';

export default function EzModal({ className, visible, children, closable = true, title, ...rest }) {
  return (
    <Modal
      {...rest}
      className={classnames('ez-modal', className)}
      visible={visible}
      footer={false}
      closable={closable}
    >
      {title && (
        <div className="ez-modal-title">{title}</div>
      )}
      {children}
    </Modal>
  );
}
