/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useCallback, useState } from 'react';
import User from '@models/user';
import Web3 from '@models/web3v2';
import I18n from '@models/i18n';
import Router from '@models/router';
import classnames from 'classnames';
import Table from '@common/table';
import FormattedMessage from '@common/formattedMessage';
import { formatDatetime } from '@utils/';

import './style.scss';

function getColumns(t, goto) {
  return [{
    title: t('history_table_date'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    className: 'createdAt',
    render: text => formatDatetime(text),
  }, {
    title: t('history_table_mission'),
    dataIndex: 'mission',
    key: 'mission',
    className: 'mission',
    render: (_, data) => <a onClick={() => goto('/mission/' + data.subMission.mission.id)}>{data.subMission.mission.name}</a>,
    props: {
      'data-label': t('history_table_mission'),
    },
  }, {
    title: t('history_table_sub_mission'),
    dataIndex: 'subMission',
    key: 'subMission',
    className: 'subMission',
    render: (_, data) => data.subMission.title,
    props: {
      'data-label': t('history_table_sub_mission'),
    },
  }, {
    title: t('history_table_state'),
    dataIndex: 'state',
    key: 'state',
    className: 'state',
    render: text => <span className={text}>{t(`mission_state_${text}`)}</span>,
    props: {
      'data-label': t('history_table_state'),
    },
  }];
}

function History() {
  const [selectedState, setSelectedState] = useState(null);
  const [rows, setRows] = useState([]);

  const {
    getUserSubMissions,
  } = User.useContainer();
  const {
    currentAccount,
  } = Web3.useContainer();
  const { t } = I18n.useContainer();
  const {
    goto,
  } = Router.useContainer();

  useEffect(() => {
    if (selectedState) {
      getUserSubMissions(selectedState).then(setRows);
    } else {
      getUserSubMissions().then(setRows);
    }
  }, [selectedState, currentAccount]);

  const columns = getColumns(t, goto);
  return (
    <div id="history">
      <div className="filter">
        <div className="row">
          <span className="label"><FormattedMessage id="missions_filter_state" /></span>
          <a className={classnames({ active: selectedState === null })} onClick={() => setSelectedState(null)}><FormattedMessage id="mission_state_all" /></a>
          <a className={classnames({ active: selectedState === 'submitted' })} onClick={() => setSelectedState('submitted')}><FormattedMessage id="mission_state_submitted" /></a>
          <a className={classnames({ active: selectedState === 'reject' })} onClick={() => setSelectedState('reject')}><FormattedMessage id="mission_state_reject" /></a>
          <a className={classnames({ active: selectedState === 'finish' })} onClick={() => setSelectedState('finish')}><FormattedMessage id="mission_state_finish" /></a>
        </div>
      </div>
      <div className="content">
        <Table
          rowKey="id"
          dataSource={rows}
          columns={columns}
        />
      </div>
    </div>
  );
}


export default History;
