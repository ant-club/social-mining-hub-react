/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useCallback } from 'react';
import FormattedMessage from '@common/formattedMessage';
import User from '@models/user';
import Router from '@models/router';
import { formatDatetime } from '@utils/';
import { UserOutlined, CrownOutlined, ClockCircleOutlined } from '@ant-design/icons';

function getRowIcon(row) {
  if (
    row.type === 'user_create'
    || row.type === 'user_update'
  ) {
    return <UserOutlined />;
  }
  if (
    row.type === 'user_sub_mission_create'
    || row.type === 'user_sub_mission_finish'
  ) {
    return <CrownOutlined />;
  }
  return <ClockCircleOutlined />;
}

function getDetailRedirect(detail) {
  if (
    detail.type === 'user_sub_mission_create'
    || detail.type === 'user_sub_mission_finish'
  ) {
    return `/mission/${detail.relatedModel.subMission.mission.id}`;
  }
  return null;
}

export default function Timeline({ userInfo }) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [isEnd, setEnd] = useState(false);

  const {
    getTimeline,
    getTimelineDetail,
  } = User.useContainer();
  const {
    goto,
  } = Router.useContainer();

  const updateNextTimeline = useCallback((zero) => {
    const query = zero ? 1 : page + 1;
    getTimeline(query).then((rows) => {
      if (zero) {
        setData(rows);
        setPage(1);
      } else {
        setData(data.concat(rows));
        setPage(page + 1);
      }
      if (rows.length < 10) {
        setEnd(true);
      }
    });
  }, [getTimeline, page, setData, data]);

  useEffect(() => {
    if (!userInfo) return;
    updateNextTimeline(true);
  }, [userInfo]);

  const handleDetailClick = (row) => {
    getTimelineDetail(row.id).then((detail) => {
      const url = getDetailRedirect(detail);
      if (!url) return;
      goto(url);
    });
  };

  return (
    <div className="timeline">
      <div className="title"><FormattedMessage id="user_timeline" /></div>
      <div className="timeline-nodes">
        {data.map(row => (
          <div className="timeline-node" key={row.id}>
            <div className="icon">{getRowIcon(row)}</div>
            <div className="datetime">{formatDatetime(row.createdAt)}</div>
            <div className="desc">
              <FormattedMessage id={`user_timeline_desc_${row.type}`} />
              {row.relatedName && (
                <a onClick={() => handleDetailClick(row)}>{row.relatedName}</a>
              )}
            </div>
          </div>
        ))}
        <div className="timeline-end">
          {isEnd ? (
            <FormattedMessage id="user_timeline_end" className="is-end" />
          ) : (
            <a onClick={() => updateNextTimeline()}><FormattedMessage id="user_timeline_next" /></a>
          )}
        </div>
      </div>
    </div>
  );
}
