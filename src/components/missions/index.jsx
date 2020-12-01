/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useCallback, useState } from 'react';
import Mission from '@models/mission';
import classnames from 'classnames';
import FormattedMessage from '@common/formattedMessage';
import MissionCard from './mission';

import './style.scss';

function Missions() {
  const [selectedState, setSelectedState] = useState(null);
  const [missions, setMissions] = useState([]);

  const {
    getMissions,
  } = Mission.useContainer();

  useEffect(() => {
    if (selectedState) {
      getMissions(selectedState).then(setMissions);
    } else {
      getMissions().then(setMissions);
    }
  }, [selectedState]);

  return (
    <div id="missions">
      <div className="filter">
        <div className="row">
          <span className="label"><FormattedMessage id="missions_filter_state" /></span>
          <a className={classnames({ active: selectedState === null })} onClick={() => setSelectedState(null)}><FormattedMessage id="missions_mission_state_all" /></a>
          <a className={classnames({ active: selectedState === 'pending' })} onClick={() => setSelectedState('pending')}><FormattedMessage id="missions_mission_state_pending" /></a>
          <a className={classnames({ active: selectedState === 'progressing' })} onClick={() => setSelectedState('progressing')}><FormattedMessage id="missions_mission_state_progressing" /></a>
          <a className={classnames({ active: selectedState === 'finished' })} onClick={() => setSelectedState('finished')}><FormattedMessage id="missions_mission_state_finished" /></a>
        </div>
      </div>
      <div className="content">
        {missions.map(mission => (
          <MissionCard key={mission.id} data={mission} />
        ))}
      </div>
    </div>
  );
}


export default Missions;
