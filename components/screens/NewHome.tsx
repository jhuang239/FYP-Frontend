import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList } from "react-native";
import React from "react";
import Carousel from 'react-native-reanimated-carousel';
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import IMAGES from "../images";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar } from 'react-native-elements';
import { useNavigation, NavigationProp, useIsFocused } from '@react-navigation/native';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffedd5',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        color: 'black'
    },
    logoutButton: {
        padding: 2,
        paddingHorizontal: 8,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 45
    },
    banner: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 45,
        marginHorizontal: 10,
        width: width
    },
    sectionHeading: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'black',
    },
    exerciseIcon: {
        fontSize: 20,
        color: 'black',
    },
    flatList: {
        marginHorizontal: 4
    },
    sectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginVertical: 20,
    },
    section2Container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginVertical: 5,
    }
})

const data = [
    {
        id: 1,
        subject: "MA1200",
        releaseTime: "01/03/2024",
        isfinished: true,
    },
    {
        id: 2,
        subject: "EE4021",
        releaseTime: "08/03/2024",
        isfinished: true,
    },
    {
        id: 3,
        subject: "MA1201",
        releaseTime: "10/03/2024",
        isfinished: true,
    },
    {
        id: 4,
        subject: "EE3012",
        releaseTime: "13/03/2024",
        isfinished: false,
    },
    {
        id: 5,
        subject: "GE2547",
        releaseTime: "17/3/2024",
        isfinished: false,
    },
]

const images = [IMAGES.PAGE1, IMAGES.PAGE2, IMAGES.PAGE3]


type HomeProps = {
    UpdateUserState(user: any): void;
};

export default function NewHome({ UpdateUserState }) {
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    React.useEffect(() => {
        if (isFocused) {
            // Do fetch here
            console.log('Do fetch here');
        }
    }, [isFocused]);

    const goToQuestionAnswerPage = (item: any) => {
        console.log(item)
        navigation.navigate('QuestionAnswer', { item });
    };

    const Logout = async () => {
        try {
            await AsyncStorage.removeItem('userData');
            UpdateUserState(null);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.title}>Ai E-Learning</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Avatar
                        rounded
                        containerStyle={{
                            width: 40,
                            height: 40,
                            marginHorizontal: 10,
                        }}
                        source={IMAGES.USER}
                    />
                    <TouchableOpacity onPress={Logout} style={styles.logoutButton}>
                        <Text>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.banner}>
                <Carousel
                    width={width}
                    height={250}
                    autoPlay={true}
                    data={images}
                    scrollAnimationDuration={10000}
                    snapEnabled={true}
                    renderItem={({ index }) => (
                        <View style={styles.container}>
                            <Image
                                source={images[index]}
                                style={{ width: width - 20, height: 250, borderRadius: 10 }}
                            />
                        </View>
                    )}
                />
            </View>
            <View>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeading}>Recent Exercise</Text>
                    <TouchableOpacity style={styles.logoutButton}>
                        <Text>Request for more</Text>
                    </TouchableOpacity>
                </View>
                <View style={{
                    justifyContent: "space-between",
                    marginHorizontal: 10,
                    height: height * 0.48,
                }}>
                    <FlatList
                        data={data}
                        numColumns={2}
                        keyExtractor={(item) => item.id + ""}
                        showsVerticalScrollIndicator={false}
                        columnWrapperStyle={{ justifyContent: 'flex-start' }}
                        style={styles.flatList}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity disabled={item.isfinished} onPress={() => goToQuestionAnswerPage(item)} style={{
                                    backgroundColor: "lightgray",
                                    height: height * 0.15,
                                    width: width * 0.42,
                                    margin: 10,
                                    borderRadius: 10,
                                    borderColor: "gray",
                                    borderWidth: 1,
                                    elevation: 2
                                }}>
                                    <View style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <IoniconsIcon
                                            name={item.isfinished ? "checkmark-done" : "document"}
                                            style={styles.exerciseIcon}
                                        />
                                        <Text>{item.subject}</Text>
                                        <Text>{item.releaseTime}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>
            </View>
        </View>
    )
}