import { View } from "react-native"
import About from "../components/About"

const AboutScreen = () => {
    return (
        <View style={styles.container}>
            <About />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default AboutScreen;