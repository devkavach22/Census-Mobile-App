import React, { useContext } from "react";

/* ---------------- CONTEXT ---------------- */

import { AuthContext } from "../../App";

/* ---------------- STACKS ---------------- */

import EnumeratorStack from "./EnumeratorStack";
import DistrictAdminStack from "./DistrictAdminStack";
import SuperAdminStack from "./SuperAdminStack";
import AuthStack from "./AuthStack";

/* ---------------- ROLE TYPES ---------------- */

export const USER_ROLES = {

    ENUMERATOR: "ENUMERATOR",

    DISTRICT_ADMIN: "DISTRICT_ADMIN",

    SUPER_ADMIN: "SUPER_ADMIN",

};

/* ---------------- ROLE BASED STACK ---------------- */

const RoleBasedStack = () => {

    const { userRole } =
        useContext(AuthContext);

    /* ---------------- SWITCH ROLE ---------------- */
    console.log("User Role in RoleBasedStack:", userRole);
    switch (userRole) {

        case USER_ROLES.ENUMERATOR:

            return <EnumeratorStack />;

        case USER_ROLES.DISTRICT_ADMIN:

            return <DistrictAdminStack />;

        case USER_ROLES.SUPER_ADMIN:

            return <SuperAdminStack />;

        default:

            return <AuthStack />;

    }

};

export default RoleBasedStack;