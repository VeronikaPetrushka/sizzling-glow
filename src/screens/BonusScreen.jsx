import { View } from "react-native"
import Bonus from "../components/Bonus"

const BonusScreen = () => {
    return (
        <View style={styles.container}>
            <Bonus />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default BonusScreen;