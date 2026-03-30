import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/* ---------------- SCREENS ---------------- */

import DistrictDashboardScreen from "../screens/districtAdmin/DistrictDashboardScreen";
import EnumeratorListScreen from "../screens/districtAdmin/EnumeratorListScreen";
import HouseholdReviewScreen from "../screens/districtAdmin/HouseholdReviewScreen";
import FraudCasesScreen from "../screens/districtAdmin/FraudCasesScreen";
import ReportsScreen from "../screens/superAdmin/ReportsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import { commonHeaderOptions } from "./CommonHeaderOptions";

/* ---------------- STACK ---------------- */

export type DistrictAdminStackParamList = {

    DistrictDashboard: undefined;

    EnumeratorList: undefined;

    HouseholdReview: {
        enumeratorId?: string;
    };

    FraudCases: undefined;

    Reports: undefined;

    Notifications: undefined;

};

const Stack =
    createNativeStackNavigator<
        DistrictAdminStackParamList
    >();

const DistrictAdminStack = () => {

    return (

        <Stack.Navigator
            initialRouteName="DistrictDashboard"
            screenOptions={commonHeaderOptions}
        >

            {/* DASHBOARD */}

            <Stack.Screen
                name="DistrictDashboard"
                component={
                    DistrictDashboardScreen
                }
            />

            {/* ENUMERATOR LIST */}

            <Stack.Screen
                name="EnumeratorList"
                component={
                    EnumeratorListScreen
                }
            />

            {/* HOUSEHOLD REVIEW */}

            <Stack.Screen
                name="HouseholdReview"
                component={
                    HouseholdReviewScreen
                }
            />

            {/* FRAUD CASES */}

            <Stack.Screen
                name="FraudCases"
                component={
                    FraudCasesScreen
                }
            />

            {/* REPORTS */}

            <Stack.Screen
                name="Reports"
                component={
                    ReportsScreen
                }
            />

            {/* NOTIFICATIONS */}

            <Stack.Screen
                name="Notifications"
                component={
                    NotificationsScreen
                }
            />

        </Stack.Navigator>

    );

};

export default DistrictAdminStack;