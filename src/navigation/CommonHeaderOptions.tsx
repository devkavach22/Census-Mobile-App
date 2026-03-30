import React from "react";
import CommonHeader from "../components/CommonHeader";

export const commonHeaderOptions = ({ route }: any) => ({
    header: () => (
        <CommonHeader
            routeName={route.name}
        />
    ),
});