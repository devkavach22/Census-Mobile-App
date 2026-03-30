import React from 'react';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

type IconType =
    | 'Material'
    | 'Ionicons'
    | 'Feather'
    | 'AntDesign'
    | 'FontAwesome';

interface Props {
    type?: IconType;
    name: string;
    size?: number;
    color?: string;
    style?: any;
}

const AppIcon = ({
    type = 'Material',
    name,
    size = 24,
    color = '#000',
    style,
}: Props) => {
    const getIcon = () => {
        switch (type) {
            case 'Ionicons':
                return <Ionicons name={name} size={size} color={color} style={style} />;

            case 'Feather':
                return <Feather name={name} size={size} color={color} style={style} />;

            case 'AntDesign':
                return <AntDesign name={name} size={size} color={color} style={style} />;

            case 'FontAwesome':
                return (
                    <FontAwesome name={name} size={size} color={color} style={style} />
                );

            default:
                return (
                    <MaterialIcons
                        name={name}
                        size={size}
                        color={color}
                        style={style}
                    />
                );
        }
    };

    return getIcon();
};

export default AppIcon;