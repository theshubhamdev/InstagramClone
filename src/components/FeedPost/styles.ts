import { StyleSheet } from "react-native";
import colors from "../../theme/colors";
import font from "../../theme/fonts";

export default StyleSheet.create({
  post: {
    marginTop:50
  },
  header: {
    flexDirection: "row",
    padding: 10,
    alignItems:"center"
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight:10
  },
  username: {
    fontWeight: font.weight.bold,
    color:colors.black
  },
  threeDots: {
    marginLeft:"auto"
  },
  image: {
    width: "100%",
    aspectRatio:1
  },
  footer: {
    padding: 10, 
  },
  iconContainer: {
    flexDirection: "row",
  },
  bold: {
    fontWeight:"bold"
  },
  text: {
    color: colors.black,
    lineHeight:18
  },
  icon: {
    marginHorizontal: 5,
  },
})
