import { View } from "react-native"
import Shop from "../components/Shop"

const ShopScreen = () => {
    return (
        <View style={styles.container}>
            <Shop />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default ShopScreen;