import config from './config';

function getTimestamp() {
  const ts = new Date().getTime();
  // PRD环境每6分钟更新一次CDN
  return parseInt(ts / (config.PROXY_DOMAIN ? 60000 : 360000), 10);
}

const QUERYS = {
  STATE_CODE: '/static/state_code.json',
  LOGIN_TOKEN: () => `/api/v1/user_login_token.json?_=${new Date().getTime()}`,
  LOGIN: '/api/v1/user_login.json',
  USER_INFO: '/api/v1/user/me.json',
  UPLOAD_ATTACHMENT: '/api/v1/upload_attachment.json',
  CONNECT_MEDIUM: token => `/auth/medium?token=${token}`,
  MISSIONS: '/api/v1/missions.json',
  MISSION: id => `/api/v1/mission/${id}.json`,
  USER_MISSION: id => `/api/v1/user/mission/${id}.json`,
  USER_SUB_MISSION: id => `/api/v1/user/sub_mission/${id}.json`,
  USER_SUB_MISSIONS: '/api/v1/user/sub_missions.json',
  USER_TIMELINE: '/api/v1/user/timeline.json',
  USER_TIMELINE_DETAIL: id => `/api/v1/user/timeline/${id}.json`,
};

const { API } = config;

Object.keys(QUERYS).forEach((key) => {
  const api = API || '';

  if (typeof QUERYS[key] === 'string') {
    QUERYS[key] = api + QUERYS[key];
  } else if (typeof QUERYS[key] === 'function') {
    const tmp = QUERYS[key];
    QUERYS[key] = (...args) => api + tmp(...args);
  }
});

export default QUERYS;
