import { useState, useEffect, useCallback } from 'react';
import { createContainer } from 'unstated-next';
import fetch from '@utils/fetch';
import message from '@utils/message';
import QUERYS from '../querys';


const getUserInfoCallback = () => fetch.get(QUERYS.USER_INFO);
const updateUserInfoCallback = data => fetch.post(QUERYS.USER_INFO, data);
const uploadAttachmentCallback = data => fetch.ajax({
  url: QUERYS.UPLOAD_ATTACHMENT,
  method: 'POST',
  data,
  processData: false,
  contentType: false,
});

const defaultStates = {
  userInfo: null,
};

function useUser(customInitialStates = {}) {
  const initialStates = {
    ...defaultStates,
    ...customInitialStates,
  };
  const [userInfo, setUserInfo] = useState(initialStates.userInfo);

  const getUserInfo = useCallback(() => getUserInfoCallback().then((data) => {
    setUserInfo(data);
    return data;
  }), [setUserInfo]);

  const updateUserInfo = useCallback(data => updateUserInfoCallback(data).then((resp) => {
    getUserInfo();
    return resp;
  }), [setUserInfo]);

  const uploadAttachment = useCallback((file) => {
    const data = new FormData();
    data.append('file', file);
    return uploadAttachmentCallback(data);
  }, []);

  const updateUserAvatar = useCallback(file => uploadAttachment(file).then(({ url }) => updateUserInfo({ avatar: url })), [setUserInfo]);

  const connectMedium = useCallback((token) => {
    window.open(QUERYS.CONNECT_MEDIUM(token), '_blank');
  }, []);

  return {
    userInfo,
    getUserInfo,
    uploadAttachment,
    updateUserAvatar,
    updateUserInfo,
    connectMedium,
  };
}

const Router = createContainer(useUser);


export default Router;
