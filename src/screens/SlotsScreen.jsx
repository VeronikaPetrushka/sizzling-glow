import { View } from "react-native"
import Slots from "../components/Slots"

const SlotsScreen = () => {
    return (
        <View style={styles.container}>
            <Slots />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default SlotsScreen;