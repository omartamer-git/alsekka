import {
    BottomSheetModal
} from '@gorhom/bottom-sheet';
import * as React from "react";


function BottomModalSheet({ children, modalVisible, setModalVisible, snapPoints, bgColor, enableDismissOnClose = true, enablePanDownToClose = true, onDismiss }) {
    React.useEffect(() => {
        if (modalVisible) {
            bottomSheetModalRef.current?.present();
        }
    }, [modalVisible]);
    // ref
    const bottomSheetModalRef = React.useRef(null);

    // callbacks
    const handlePresentModalPress = React.useCallback(() => {
    }, []);
    const handleSheetChanges = React.useCallback((index: number) => {
        // console.log('handleSheetChanges', index);
    }, []);

    return (
        <React.Fragment>
            <BottomSheetModal
                backgroundStyle={{ backgroundColor: bgColor || '#fff' }}
                ref={bottomSheetModalRef}
                index={0}
                enablePanDownToClose={enablePanDownToClose}
                enableDismissOnClose={enableDismissOnClose}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                onDismiss={() => { if (setModalVisible) { setModalVisible(false) } if (onDismiss) { onDismiss() } }}
                style={{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 7,
                    },
                    shadowOpacity: 0.41,
                    shadowRadius: 9.11,

                    elevation: 14,
                }}
            >
                {children}
            </BottomSheetModal>
        </React.Fragment>
    );
};

export default BottomModalSheet;