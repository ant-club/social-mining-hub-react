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
const getUserMissionStateCallback = id => fetch.get(QUERYS.USER_MISSION(id));
const getUserSubMissionsCallback = data => fetch.get(QUERYS.USER_SUB_MISSIONS, data);
const submitUserSubMissionCallback = (id, data) => fetch.post(QUERYS.USER_SUB_MISSION(id), data);
const getTimelineCallback = page => fetch.get(QUERYS.USER_TIMELINE, { page });
const getTimelineDetailCallback = id => fetch.get(QUERYS.USER_TIMELINE_DETAIL(id));

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

  const getUserMissionState = useCallback(missionId => getUserMissionStateCallback(missionId), []);
  const submitUserSubMission = useCallback((missionId, data) => submitUserSubMissionCallback(missionId, data), []);
  const getUserSubMissions = useCallback(state => getUserSubMissionsCallback({ state }), []);
  const getTimeline = useCallback(page => getTimelineCallback(page), []);
  const getTimelineDetail = useCallback(id => getTimelineDetailCallback(id), []);

  return {
    userInfo,
    getUserInfo,
    uploadAttachment,
    updateUserAvatar,
    updateUserInfo,
    connectMedium,
    getUserMissionState,
    submitUserSubMission,
    getUserSubMissions,
    getTimeline,
    getTimelineDetail,
  };
}

const Router = createContainer(useUser);


export default Router;
