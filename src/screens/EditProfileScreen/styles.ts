import { StyleSheet } from "react-native";
import colors from "../../theme/colors";
import fonts from "../../theme/fonts";

export default StyleSheet.create({
  page: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.black,
    flex: 1,
  },
  avatar: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 100,
  },
  textButton: {
    color: colors.primary,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.semi,
    margin: 10,
  },
  textButtonDanger: {
    color: colors.error,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.semi,
    margin: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 15,
  },
  label: {
    color: colors.white,
    width: 75,
  },
  input: {
    color: colors.white,
    borderBottomWidth: 1,
    minHeight: 50,
  },
});