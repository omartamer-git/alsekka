import React, { useRef } from 'react';
import { TextInput } from 'react-native';

const SHOW_RENDER_COUNTERS = false;

const useRenderCounter = () => {
    const renderCount = useRef(0);
    renderCount.current = renderCount.current + 1;

    if (__DEV__ && SHOW_RENDER_COUNTERS) {
        return (
            <TextInput
                style={{
                    backgroundColor: 'hsl(0, 100%, 50%)',
                    borderRadius: 6,
                    color: 'hsl(0, 0%, 100%)',
                    fontSize: 10,
                    fontWeight: 'bold',
                    height: 35,
                    margin: 2,
                    textAlign: 'center',
                    width: 35,
                    position: 'absolute',
                    zIndex: 99,
                    left: 0,
                    top: 0
                }}
                value={String(renderCount.current)}
            />
        );
    }
    return null;
};

export default useRenderCounter;
