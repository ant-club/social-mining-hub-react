/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useCallback, useState } from 'react';
import classnames from 'classnames';
import Mission from '@models/mission';
import Web3 from '@models/web3v2';
import User from '@models/user';
import { Spin, Button } from '@common/antd';
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import FormattedMessage from '@common/formattedMessage';
import Modal from './submitModal';

import './style.scss';

function process(data) {
  const {
    subMissions,
  } = data;

  const processed = [];
  const expends = {};

  subMissions.forEach((subMission) => {
    const {
      provider,
    } = subMission;
    let missionList = processed.find(p => p.provider === provider);
    if (!missionList) {
      missionList = {
        provider,
        subMissions: [],
        expend: false,
      };
      processed.push(missionList);
    }
    missionList.subMissions.push(subMission);
    expends[provider] = false;
  });

  return [{
    ...data,
    subMissionGroups: processed,
  }, expends];
}

function MissionDetail({ match }) {
  const [data, setData] = useState(null);
  const [expends, setExpends] = useState({});
  const [userState, setUserState] = useState({});
  const [selectedSubMission, setSelectedSubMission] = useState(null);
  const [submitModalVisible, showSubmitModal] = useState(false);

  const {
    getMissionDetail,
  } = Mission.useContainer();

  const {
    currentAccount,
  } = Web3.useContainer();

  const {
    userInfo,
    getUserMissionState,
  } = User.useContainer();

  useEffect(() => {
    if (match && match.params && match.params.id) {
      getMissionDetail(match.params.id).then((response) => {
        const [d, e] = process(response);
        setData(d);
        setExpends(e);
      });
    }
  }, []);

  useEffect(() => {
    if (userInfo && data) {
      getUserMissionState(data.id).then((response) => {
        const us = {};
        response.forEach((state) => {
          us[state.subMissionId] = state;
        });
        setUserState(us);
      });
    }
  }, [userInfo, data]);

  const handleExpendGroup = (provider) => {
    const newExpends = { ...expends };
    newExpends[provider] = !newExpends[provider];
    setExpends(newExpends);
  };

  const handleOpenSubmit = (subMission) => {
    setSelectedSubMission(subMission);
    showSubmitModal(true);
  };

  const handleSubmitSuccess = () => {
    showSubmitModal(false);
    getUserMissionState(data.id).then((response) => {
      const us = {};
      response.forEach((state) => {
        us[state.subMissionId] = state;
      });
      setUserState(us);
    });
  };

  const {
    subMissionGroups,
  } = (data || {});
  return (
    <div id="mission">
      {data ? (
        <>
          <div className="content">
            {subMissionGroups.map(subMissionGroup => (
              <div className={classnames('mission-group', { expend: expends[subMissionGroup.provider] })} key={subMissionGroup.provider}>
                <div className="group-title" onClick={() => handleExpendGroup(subMissionGroup.provider)}>
                  {expends[subMissionGroup.provider] ? (
                    <MinusSquareOutlined />
                  ) : (
                    <PlusSquareOutlined />
                  )}
                  <FormattedMessage id={`mission_group_title_${subMissionGroup.provider}`} />
                </div>
                <div className="sub-missions">
                  {subMissionGroup.subMissions.map(subMission => (
                    <div className="sub-mission" key={subMission.id}>
                      <div className="score">{subMission.score}</div>
                      <div className="info">
                        <div className="title">{subMission.title}</div>
                        <div className="description">{subMission.description}</div>
                        {!userState[subMission.id] && (
                          <div className="opt">
                            <Button type="primary" onClick={() => handleOpenSubmit(subMission)}><FormattedMessage id="mission_btn_submit" /></Button>
                          </div>
                        )}
                      </div>
                      <div className={classnames('state', userState[subMission.id] ? userState[subMission.id].state : 'todo')}>
                        {userState[subMission.id] ? (
                          <FormattedMessage id={`mission_state_${userState[subMission.id].state}`} />
                        ) : (
                          <FormattedMessage id="mission_state_todo" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Modal
            visible={submitModalVisible}
            data={selectedSubMission}
            onCancel={() => showSubmitModal(false)}
            onSuccess={handleSubmitSuccess}
          />
        </>
      ) : (
        <div className="no-data">
          <Spin />
        </div>
      )}
    </div>
  );
}


export default MissionDetail;
