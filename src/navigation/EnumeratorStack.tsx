import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import EnumeratorDashboard from "../screens/enumerator/EnumeratorDashboard";
import MembersScreen from "../screens/enumerator/MembersScreen";
import SurveyScreen from "../screens/enumerator/SurveyScreen";
import SummaryScreen from "../screens/enumerator/SummaryScreen";
import MapScreen from "../screens/enumerator/MapScreen";
import {
    getStorageData,
    STORAGE_KEYS,
} from "../utils/storage";
import HouseholdScreen from "../screens/enumerator/HouseholdScreen";
import VerificationScreen from "../screens/enumerator/VerificationScreen";

const Stack = createNativeStackNavigator();

const EnumeratorStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen
            name="EnumeratorDashboard"
            component={EnumeratorDashboard}
        />

        <Stack.Screen
            name="AddHousehold"
            component={HouseholdScreen}
        />

        <Stack.Screen
            name="AddMembers"
            component={MembersScreen}
        />

        <Stack.Screen
            name="Verification"
            component={VerificationScreen}
        />

        <Stack.Screen
            name="Survey"
            component={SurveyScreen}
        />

        <Stack.Screen
            name="MapView"
            component={MapScreen}
        />

        <Stack.Screen
            name="Summary"
            component={SummaryScreen}
        />

    </Stack.Navigator>
);



export default EnumeratorStack;