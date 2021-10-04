import React, { FC, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import firebase from 'firebase';
import AppStack from './appstack';
import AuthStack from './authstack';

const MainNav: FC = () => {
    const [user, setUser] = useState<any>(null);

    const bootstrap = () => {
        firebase.auth().onAuthStateChanged((changedUser) => {
            if (changedUser) setUser(changedUser);
        });
    };

    useEffect(() => {
        bootstrap();
    }, []);

    return <NavigationContainer>{user ? <AppStack /> : <AuthStack />}</NavigationContainer>;
};

export default MainNav;
