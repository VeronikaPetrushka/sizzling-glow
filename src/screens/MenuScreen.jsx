import { View } from "react-native"
import Menu from "../components/Menu"

const MenuScreen = () => {
    return (
        <View style={styles.container}>
            <Menu />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default MenuScreen;