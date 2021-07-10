import React from 'react';
import {
    ActivityIndicator,
    View
} from 'react-native';

const Loader = (props) => {
    return (
        <>
            {props.isLoading &&
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator color={"#A9A9A9"} size={'large'} />
                </View>
            }
        </>
    )
};

export default Loader;
