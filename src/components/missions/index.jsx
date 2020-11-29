/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useCallback, useState } from 'react';
import Mission from '@models/mission';
import { Spin } from '@common/antd';
import MissionCard from './mission';

import './style.scss';

function Missions() {
  const [missions, setMissions] = useState([]);

  const {
    getMissions,
  } = Mission.useContainer();

  useEffect(() => {
    getMissions().then(setMissions);
  }, []);

  return (
    <div id="missions">
      <div className="content">
        {missions.map(mission => (
          <MissionCard key={mission.id} data={mission} />
        ))}
      </div>
    </div>
  );
}


export default Missions;
