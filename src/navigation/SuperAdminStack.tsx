import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/* ---------------- SCREENS ---------------- */

import NationalDashboardScreen from "../screens/superAdmin/NationalDashboardScreen";
import StatePerformanceScreen from "../screens/superAdmin/StatePerformanceScreen";
import DistrictPerformanceScreen from "../screens/superAdmin/DistrictPerformanceScreen";
import FraudAnalyticsScreen from "../screens/superAdmin/FraudAnalyticsScreen";
import ReportsScreen from "../screens/superAdmin/ReportsScreen";
import UserManagementScreen from "../screens/superAdmin/UserManagementScreen";
import { commonHeaderOptions } from "./CommonHeaderOptions";

/* ---------------- PARAM TYPES ---------------- */

export type SuperAdminStackParamList = {

    NationalDashboard: undefined;

    StatePerformance: {
        stateId?: string;
    };

    DistrictPerformance: {
        districtId?: string;
    };

    FraudAnalytics: undefined;

    Reports: undefined;

    UserManagement: undefined;

};

const Stack =
    createNativeStackNavigator<
        SuperAdminStackParamList
    >();

/* ---------------- STACK ---------------- */

const SuperAdminStack = () => {

    return (

        <Stack.Navigator
            initialRouteName="NationalDashboard"
            screenOptions={commonHeaderOptions}
        >

            {/* NATIONAL DASHBOARD */}

            <Stack.Screen
                name="NationalDashboard"
                component={
                    NationalDashboardScreen
                }
            />

            {/* STATE PERFORMANCE */}

            <Stack.Screen
                name="StatePerformance"
                component={
                    StatePerformanceScreen
                }
            />

            {/* DISTRICT PERFORMANCE */}

            <Stack.Screen
                name="DistrictPerformance"
                component={
                    DistrictPerformanceScreen
                }
            />

            {/* FRAUD ANALYTICS */}

            <Stack.Screen
                name="FraudAnalytics"
                component={
                    FraudAnalyticsScreen
                }
            />

            {/* REPORTS */}

            <Stack.Screen
                name="Reports"
                component={
                    ReportsScreen
                }
            />

            {/* USER MANAGEMENT */}

            <Stack.Screen
                name="UserManagement"
                component={
                    UserManagementScreen
                }
            />

        </Stack.Navigator>

    );

};

export default SuperAdminStack;