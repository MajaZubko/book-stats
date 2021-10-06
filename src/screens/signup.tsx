import React, { FC, useState } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import firebase from 'firebase';
import { Input, Button } from '../components';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DARK_BLUE } from '../constants/colors';

interface Props {
    navigation: {
        navigate: (route: string) => void;
    };
}

const SignUp: FC<Props> = ({ navigation }) => {
    const [name, setName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);

    const signup = async () => {
        if (name && email && password) {
            try {
                const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password);
                if (user) {
                    await firebase.firestore().collection('users').doc(user.uid).set({ name, email, password });
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            Alert.alert('Error', 'Missing fields');
        }
    };

    return (
        <View style={styles.container}>
            <Input placeholder="Name" onChangeText={(text) => setName(text)} />
            <Input placeholder="Email" onChangeText={(text) => setEmail(text)} />
            <Input placeholder="Password" onChangeText={(text) => setPassword(text)} secureTextEntry />
            <Button title="Sign Up" onPress={signup} />

            <View style={styles.loginText}>
                <Text>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('login')}>
                    <Text style={{ color: DARK_BLUE }}>Login Here</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        flexDirection: 'row',
        marginVertical: 20,
    },
});
