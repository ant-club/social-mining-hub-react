/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import FormattedMessage from '@common/formattedMessage';
import Router from '@models/router';
import { formatDate } from '@utils/';


export default function MissionCard({ data }) {
  const { goto } = Router.useContainer();

  const {
    id,
    startAt,
    endAt,
    state,
    image,
    name,
  } = data;

  const start = formatDate(startAt);
  const end = formatDate(endAt);

  return (
    <a className="mission" onClick={() => goto(`/mission/${id}`)}>
      <div className={classnames('state', state)}><FormattedMessage id={`missions_mission_state_${state}`} /></div>
      <div className="img"><img src={image} alt="" /></div>
      <div className="info">
        <div className="title">{name}</div>
        <div className="date">{start} - {end}</div>
      </div>
    </a>
  );
}
