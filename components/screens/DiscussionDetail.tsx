import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Dimensions, Image } from "react-native";
import React from "react";
import IMAGES from "../images";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { Overlay } from "react-native-elements";
import { useNavigation } from '@react-navigation/native';
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import FeatherIcon from "react-native-vector-icons/Feather";




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
    backButton: {
        margin: 5,
        fontSize: 40,
        color: "black",
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        color: 'black',
    },
    discussionConatiner: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        paddingHorizontal: 20,
        padding: 5,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        backgroundColor: '#ffedd5'
    },
    createDiscussionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 45,
        padding: 2,
        paddingHorizontal: 5,
        backgroundColor: 'white'
    },
    moreIcon: {
        margin: 5,
        fontSize: 30,
        color: "black",
    },
    commentsContainer: {

    },
    replyContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    sendButton: {
        margin: 5,
        fontSize: 20,
        color: "black",
    }
})



export default function DiscussionDetail({ route }) {
    const { details } = route.params;

    const temp = {
        id: 1,
        topic: "EE2013 Assignment 1",
        category: "EE2013",
        author: "Peter",
        date: "12/03/2021 10:00pm",
        image: 'https://images.unsplash.com/photo-1699959560616-aa17ace76879?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        description: "This study explores the influence of virtual reality (VR) technology on learning outcomes in higher education settings. \n\nThe research investigates the potential benefits and challenges associated with integrating VR into traditional learning environments. By analyzing existing literature, empirical studies, and qualitative interviews, this research aims to provide insights into the effectiveness of VR in enhancing student engagement, knowledge acquisition, and skill development. \n\nAdditionally, the study examines the potential limitations and ethical considerations associated with VR implementation in academic settings. \n\nThe findings of this research contribute to the growing body of knowledge on the pedagogical implications of immersive technologies and inform educational institutions' strategies for incorporating VR into their curricula.",
        comments: [
            {
                author: "John",
                detail: "How do you do?",
                date: "12/03/2021 10:00pm",
            },
            {
                author: "Ken",
                detail: "Good",
                date: "12/03/2021 10:00pm",
            },
            {
                author: "Kelven",
                detail: "Not really",
                date: "12/03/2021 10:00pm",
            },
            {
                author: "John",
                detail: "How's your homework?",
                date: "12/03/2021 10:00pm",
            },
            {
                author: "Ken",
                detail: "Not yet started",
                date: "12/03/2021 10:00pm",
            },
        ]
    }

    const [data, setData] = React.useState(temp);
    const [isOverlayShow, setIsOverlayShow] = React.useState(false);
    const [userInput, setUserInput] = React.useState("");
    const navigation = useNavigation();

    const goToBack = () => {
        navigation.goBack();
    };
    const onChangeText = (text) => {
        setUserInput(text)
    }

    React.useEffect(() => {
        // Do fetch here
        try {

        } catch (error) {

        } finally {

        }
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <IoniconsIcon
                    name="arrow-back"
                    style={styles.backButton}
                    onPress={() => goToBack()}
                />
                <FeatherIcon
                    name="more-vertical"
                    style={styles.moreIcon}
                    onPress={() => {
                        setIsOverlayShow(true);
                    }}
                />
            </View>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ marginBottom: 100,height: height*0.3 }}>
                    <View style={{ marginHorizontal: 10, marginBottom: 30, paddingBottom: 30, borderBottomColor: 'gray', borderBottomWidth: 1 }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: "center",
                                padding: 5
                            }}>
                                <Image
                                    source={IMAGES.USER}
                                    style={{
                                        height: 50,
                                        width: 50,
                                        aspectRatio: 1,
                                        borderRadius: 25
                                    }}
                                />
                                <View style={{
                                    flexDirection: 'column',
                                    width: width * 0.83,
                                    padding: 5
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: "center",
                                        padding: 5
                                    }}>
                                        <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>{data.topic}</Text>
                                        <Text style={{ fontSize: 10, borderWidth: 1, borderColor: 'gray', borderRadius: 45, paddingHorizontal: 7 }}>{data.category}</Text>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        padding: 5
                                    }}>
                                        <Text style={{ fontSize: 13 }}>{data.author + " · " + data.date}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <Image
                            source={{ uri: data.image }}
                            style={{
                                width: width * 0.95,
                                aspectRatio: 1,
                                borderRadius: 25,
                                marginBottom: 10
                            }}
                        />
                        <Text style={{ color: "black" }}>{data.description}</Text>
                    </View>
                    <View style={styles.commentsContainer}>
                        {
                            data.comments.map((comment, index) => {
                                return (
                                    <View key={index} style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: "center",
                                        margin: 10,
                                        marginTop: 0,
                                        borderBottomColor: 'gray',
                                        borderBottomWidth: (index == data.comments.length - 1 ? 0 : 0.5)
                                    }}>
                                        <Image
                                            source={IMAGES.USER}
                                            style={{
                                                height: 50,
                                                width: 50,
                                                aspectRatio: 1,
                                                borderRadius: 25
                                            }}
                                        />
                                        <View style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            margin: 10,
                                        }}>
                                            <View style={{
                                                justifyContent: 'flex-start',
                                            }}>
                                                <Text style={{ fontSize: 13 }}>{comment.author}</Text>
                                                <Text style={{ fontSize: 15, color: "black" }}>{comment.detail}</Text>
                                            </View>
                                            <Text style={{ fontSize: 13 }}>{comment.date}</Text>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                </ScrollView>
                <View style={styles.replyContainer}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: "center",
                        marginHorizontal: 10
                    }}>
                        <Image
                            source={IMAGES.USER}
                            style={{
                                height: 50,
                                width: 50,
                                aspectRatio: 1,
                                borderRadius: 25
                            }}
                        />
                        <View style={{ flex: 1 }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: "center",
                            }}>
                                <TextInput
                                    placeholder="Give a reply"
                                    multiline
                                    numberOfLines={3}
                                    style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 20, paddingHorizontal: 7, flex: 1, margin: 10 }}
                                    onChangeText={onChangeText}
                                    value={userInput}
                                />
                                <IoniconsIcon
                                    name="send"
                                    style={styles.sendButton}
                                    onPress={() => { }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>

            < Overlay
                isVisible={isOverlayShow}
                onBackdropPress={() => {
                    setIsOverlayShow(false)
                }}
            >
                <Text style={styles.ItemName}>Action</Text>
                <TouchableOpacity style={styles.ToolsOverlayItems}>
                    <EntypoIcon name="folder" style={styles.ItemIcon} />

                    <Text>folder</Text>
                </TouchableOpacity>
            </Overlay >
        </View>
    )
}