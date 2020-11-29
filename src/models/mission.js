import { useState, useEffect, useCallback } from 'react';
import { createContainer } from 'unstated-next';
import fetch from '@utils/fetch';
import QUERYS from '../querys';


const getMissionsCallback = () => fetch.get(QUERYS.MISSIONS);
const getMissionDetailCallback = id => fetch.get(QUERYS.MISSION(id));
const defaultStates = {};

function useMission(customInitialStates = {}) {
  const initialStates = {
    ...defaultStates,
    ...customInitialStates,
  };

  const getMissions = useCallback(() => getMissionsCallback(), []);

  const getMissionDetail = useCallback(id => getMissionDetailCallback(id), []);

  return {
    getMissions,
    getMissionDetail,
  };
}

const Router = createContainer(useMission);

export default Router;
