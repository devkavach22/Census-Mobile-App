import React, { useContext } from 'react';

/* ---------------- CONTEXT ---------------- */

import { AuthContext } from '../../App';

/* ---------------- STACKS ---------------- */

import EnumeratorStack from './EnumeratorStack';
import DistrictAdminStack from './DistrictAdminStack';
import SuperAdminStack from './SuperAdminStack';
import AuthStack from './AuthStack';

/* ---------------- ROLE TYPES ---------------- */

export const USER_ROLES = {
  ENUMERATOR: 'enumerator',
  DISTRICT_ADMIN: 'district_admin',
  SUPER_ADMIN: 'national_admin',
};

/* ---------------- ROLE BASED STACK ---------------- */

const RoleBasedStack = () => {
  const { userDetails } = useContext(AuthContext);

  /* ---------------- SWITCH ROLE ---------------- */
  console.log('User Role in RoleBasedStack:', userDetails);
  switch (userDetails?.role) {
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
