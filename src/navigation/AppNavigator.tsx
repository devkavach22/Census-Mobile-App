import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import HouseholdScreen from "../screens/HouseholdScreen";
import MembersScreen from "../screens/MembersScreen";
import SurveyScreen from "../screens/SurveyScreen";
import SummaryScreen from "../screens/SummaryScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: "center",
            }}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
            />

            <Stack.Screen
                name="Household"
                component={HouseholdScreen}
            />

            <Stack.Screen
                name="Members"
                component={MembersScreen}
            />

            <Stack.Screen
                name="Survey"
                component={SurveyScreen}
            />

            <Stack.Screen
                name="Summary"
                component={SummaryScreen}
            />

        </Stack.Navigator>
    );
};

export default AppNavigator;