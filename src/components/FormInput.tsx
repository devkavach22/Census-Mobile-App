import React from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
} from "react-native";

const FormInput = ({
    label,
    placeholder,
}: any) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label}
            </Text>

            <TextInput
                placeholder={placeholder}
                style={styles.input}
            />
        </View>
    );
};

export default FormInput;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 14,
    },

    label: {
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 6,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        backgroundColor: "#F8FAFC",
    },
});