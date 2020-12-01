import { useState, useEffect, useCallback } from 'react';
import { createContainer } from 'unstated-next';
import fetch from '@utils/fetch';
import QUERYS from '../querys';


const getMissionsCallback = data => fetch.get(QUERYS.MISSIONS, data);
const getMissionDetailCallback = id => fetch.get(QUERYS.MISSION(id));
const defaultStates = {};

function useMission(customInitialStates = {}) {
  const initialStates = {
    ...defaultStates,
    ...customInitialStates,
  };

  const getMissions = useCallback(state => getMissionsCallback({ state }), []);

  const getMissionDetail = useCallback(id => getMissionDetailCallback(id), []);

  return {
    getMissions,
    getMissionDetail,
  };
}

const Router = createContainer(useMission);

export default Router;
