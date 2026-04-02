import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/* ---------------- SCREENS ---------------- */

import DistrictDashboardScreen from '../screens/districtAdmin/DistrictDashboardScreen';
import StatePerformanceScreen from '../screens/superAdmin/StatePerformanceScreen';
import NationalDashboardScreen from '../screens/superAdmin/NationalDashboardScreen';

/* ---------------- STACK ---------------- */

export type DistrictAdminStackParamList = {
  DistrictDashboard: undefined;

  StatePerformance: undefined;

  NationalDashboard: undefined;
};

const Stack = createNativeStackNavigator<DistrictAdminStackParamList>();

const DistrictAdminStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="DistrictDashboard"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* DASHBOARD */}

      <Stack.Screen
        name="DistrictDashboard"
        component={DistrictDashboardScreen}
      />
      <Stack.Screen
        name="StatePerformance"
        component={StatePerformanceScreen}
      />

      <Stack.Screen
        name="NationalDashboard"
        component={NationalDashboardScreen}
      />
    </Stack.Navigator>
  );
};

export default DistrictAdminStack;
