import * as React from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    Text,
    Platform,
} from "react-native";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import { Overlay, LinearProgress, CheckBox } from "react-native-elements";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';



const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
    topbar: {
        paddingTop: Platform.OS == "ios" ? 20 : 0,
        flexDirection: "row",
        alignItems: "center",
        width: width,
        backgroundColor: "#ffedd5",
        justifyContent: "space-between",
    },
    backButton: {
        margin: 10,
        fontSize: 40,
        color: "black",
    },
    progressBar: {
        width: width * 0.8,
        marginRight: 10
    },
    container: {
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#ffedd5",
        height: Platform.OS == "ios" ? height * 0.95 : height,
    },
    questionNumberContainer: {
        justifyContent: "flex-start",
        alignItems: "center",
        marginVertical: 10,
    },
    questionNumberText: {
        fontSize: 30,
        color: "black",
        fontWeight: "bold",
        textAlign: "center",
    },
    questionTitleContainer: {
        justifyContent: "flex-start",
        alignItems: "center",
        margin: 20,
    },
    questionTitleText: {
        fontSize: 20,
        color: "black",
        textAlign: "center",
    },
    answerRow: {
        margin: 10,
        paddingVertical: 5,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: width * 0.9,
        borderRadius: 10,
    },
    answerText: {
        flexWrap: 'wrap',
        flex: 1,
        fontSize: 16,
        color: "black",
        margin: 5,
        textAlign: 'left',
    },
    buttonGroup: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: width,
        margin: 10
    },
    previousButton: {
        margin: 10,
        padding: 10,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 45,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#870331",
        width: width * 0.3,
    },
    previousButtonText: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    nextButton: {
        margin: 10,
        padding: 10,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 45,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#032487",
        width: width * 0.3,
    },
    nextButtonText: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    finishButton: {
        margin: 10,
        padding: 10,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 45,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#03871b",
        width: width * 0.3,
    },
    finishButtonText: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    overlayContainer: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        margin: 10,
        padding: 10,
        width: width * 0.6,
        height: height * 0.2,
    },
    overlayText: {
        fontSize: 20,
        color: "black",
        fontWeight: "bold",
        textAlign: "center",
    },
    overlayButton: {
        margin: 10,
        marginTop: 20,
        padding: 10,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 45,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#03871b",
        width: width * 0.3,
    },
    overlayButtonText: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    }
});

const QuestionAnswer = ({ route }) => {
    const { item } = route.params;
    const navigation = useNavigation();

    const goToBack = () => {
        navigation.goBack();
    };
    const defaultDatas = { question: "", answer: "", options: [] }
    const [datas, setDatas] = React.useState([defaultDatas]);

    const [currentLocation, setCurrentLocation] = React.useState(0);
    const [showOverlay, setshowOverlay] = React.useState(false);
    const [overlayMessage, setOverlayMessage] = React.useState("");
    const [answers, setAnswers] = React.useState<string[]>([]);
    const [isFinish, setIsFinish] = React.useState(false);


    const updateAnswers = (option: string) => {
        let newAnswer = [...answers];
        if (newAnswer[currentLocation] != option) {
            newAnswer[currentLocation] = option;
        } else {
            newAnswer = newAnswer.slice(0, currentLocation).concat(newAnswer.slice(currentLocation + 1));
        }
        setAnswers(newAnswer);
    }

    const pressNext = () => {
        if (datas[currentLocation].answer.split(" - ")[0] == answers[currentLocation]) {
            if (answers.length > currentLocation) {
                setCurrentLocation(currentLocation + 1);
            } else {
                setOverlayMessage("Please finish current question first");
                setshowOverlay(true)
            }
        } else {
            setOverlayMessage("Seems your answer is not correct");
            setshowOverlay(true)
        }
    }

    const pressPrevious = () => {
        setCurrentLocation(currentLocation - 1);
    }

    const pressFinish = async () => {
        if (answers.length != datas.length) {
            setOverlayMessage("Exercise not completed");
            setshowOverlay(true);
        }

        try {
            // Do Post Submission
            const userinfo = await AsyncStorage.getItem('userData').then(value => {
                if (value) {
                    return JSON.parse(value);
                }
            });
            if (userinfo == null) return;

            var response = await axios.put(`http://3.26.57.153:8000/quiz/put_quiz?quiz_id=${item.quiz_id}`, {
                dummy: ""
            }, {
                headers: {
                    Authorization: `Bearer ${userinfo.token}`,
                },
            });

            setIsFinish(true);
            setOverlayMessage("Task Completed");
        } catch (error) {
            console.log("Error send request:" + error);
            setOverlayMessage("Submission Failed. Please check the network connection");
        } finally {
            setshowOverlay(true);
        }
    }

    const fetchQuestion = async () => {
        try {
            const userinfo = await AsyncStorage.getItem('userData').then(value => {
                if (value) {
                    return JSON.parse(value);
                }
            });
            if (userinfo == null) return;

            var response = await fetch(`http://3.26.57.153:8000/quiz/get_quiz?quiz_id=${item.quiz_id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userinfo.token}`,
                },
            });

            // Handle response
            if (response.ok) {
                const datas = await response.json();
                setDatas(datas.content)
                console.log(datas)
            }
        } catch (error) {
            console.log("Error send request:" + error);
        }
    }

    const closeOverlay = () => {
        setshowOverlay(false)
    }


    React.useEffect(() => {
        fetchQuestion();
    }, []);

    React.useEffect(() => {
        if (!showOverlay && isFinish) {
            navigation.goBack();
        }
    }, [showOverlay]);

    return (
        <View>
            <View style={styles.topbar}>
                <IoniconsIcon
                    name="arrow-back"
                    style={styles.backButton}
                    onPress={() => goToBack()}
                />
                <LinearProgress
                    variant="determinate"
                    style={styles.progressBar}
                    value={answers.length / datas.length}
                />
            </View>
            <View style={styles.container}>
                <View style={styles.questionNumberContainer}>
                    <Text style={styles.questionNumberText}>{"Question  " + (currentLocation + 1)}</Text>
                </View>
                <View style={styles.questionTitleContainer}>
                    <Text style={styles.questionTitleText}>{datas[currentLocation].question}</Text>
                </View>
                <View style={{ margin: 20 }}>
                    {
                        datas[currentLocation].options.map((option, index) => (
                            <View key={index} style={answers[currentLocation] == option ? (datas[currentLocation].answer.split(" - ")[0] == answers[currentLocation] ? { ...styles.answerRow, backgroundColor: "#68ba7e" } : { ...styles.answerRow, backgroundColor: "#c47070" }) : styles.answerRow}>
                                <CheckBox
                                    checked={answers[currentLocation] == option}
                                    onPress={() => updateAnswers(option)}
                                    iconType="material-community"
                                    checkedIcon="checkbox-outline"
                                    uncheckedIcon='checkbox-blank-outline'
                                />
                                <Text style={styles.answerText}>{option}</Text>
                            </View>
                        ))
                    }
                </View>
                <View style={{ margin: 20 }}>
                    {
                        datas[currentLocation].answer.split(" - ")[0] == answers[currentLocation] ? (
                            <View>
                                <Text style={{ color: "black", fontWeight: "bold", fontSize: 15 }}>Learning Corner:</Text>
                                <Text>{datas[currentLocation].answer.split(" - ")[1]}</Text>
                            </View>
                        ) : (<></>)
                    }
                </View>
                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={currentLocation != 0 ? styles.previousButton : { ...styles.previousButton, display: 'none' }} onPress={pressPrevious}>
                        <Text style={styles.previousButtonText}>Previous</Text>
                    </TouchableOpacity>
                    {currentLocation != datas.length - 1 ? (
                        <TouchableOpacity style={styles.nextButton} onPress={pressNext} >
                            <Text style={styles.nextButtonText}>Next</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.finishButton} onPress={pressFinish} >
                            <Text style={styles.finishButtonText}>Finish</Text>
                        </TouchableOpacity>
                    )
                    }
                </View>
                {/* Here is the Overlay group */}
                < Overlay
                    isVisible={showOverlay}
                    onBackdropPress={() => { closeOverlay }}
                >
                    <View style={styles.overlayContainer}>
                        <Text style={styles.overlayText}>{overlayMessage}</Text>
                        <TouchableOpacity style={styles.overlayButton} onPress={closeOverlay} >
                            <Text style={styles.overlayButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </Overlay >
            </View >
        </View >
    );
};

export default QuestionAnswer;
