import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, FlatList, SafeAreaView, View } from 'react-native';
import firebase from 'firebase';

import { PendingPost, Button } from '../components';

interface Props {
    navigation: {
        navigate: (route: string) => void;
        goBack: () => void;
    };
}
const Dashboard: FC<Props> = ({ navigation }) => {
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        fetchPendingPosts();
    }, []);

    const fetchPendingPosts = async () => {
        firebase
            .firestore()
            .collection('posts')
            .where('approved', '==', false)
            .onSnapshot((querySnaphot) => {
                const documents = querySnaphot.docs;
                setPosts(documents);
            });
        // const posts = await firebase.firestore().collection('posts').where('approved', '==', false).get();
        // setPosts([...posts.docs]);
    };

    const approve = async (id: string) => {
        const post = await firebase.firestore().collection('posts').doc(id).get();
        await post.ref.set({ approved: true }, { merge: true });
    };

    const decline = async (id: string) => {
        await firebase.firestore().collection('posts').doc(id).delete();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.backButton}>
                <Button onPress={() => navigation.goBack()} title="Back" />
            </View>
            <FlatList
                data={posts}
                renderItem={({ item }) => (
                    <PendingPost
                        message={item.data().text}
                        timestamp={item.data().timeStamp.toDate().toDateString()}
                        approved={item.data().approved}
                        onApprove={() => approve(item.id)}
                        onDecline={() => decline(item.id)}
                    />
                )}
            />
        </SafeAreaView>
    );
};

export default Dashboard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        alignSelf: 'flex-start',
        marginHorizontal: 20,
    },
});
