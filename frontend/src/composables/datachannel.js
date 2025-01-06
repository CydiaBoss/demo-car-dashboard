
import { ref, reactive, onUnmounted } from "vue";

/**
 * Creates a composable interface for the backend connection
 * 
 * @returns composable version of websocket connection
 */
export function getDataChannel() {
    // Private refs
    const websocket = ref(null);
    const dataConnected = ref(false);

    // Exposed data payload
    const data = reactive({
        indicators: {
            "ParkingBreak": 0,
            "CheckEngine": 0,
            "MotorStatus": 0,
            "LowBattery": 0
        },
        motorData: {
            "GearRatio": "1/2",
            "BatteryLevel": 100,
            "BatteryTemp": 25,
            "MotorSpeed": 0,
            "MotorPower": 0
        },
        motorSettings: {
            "MotorSpeed": 0,
            "ChargeMode": 0
        }
    });

    // Connect to the backend websocket
    const connect = () => {
        websocket.value = new WebSocket(`ws://${import.meta.env.VITE_BACKEND}/data`);
        
        // On connect notification
        websocket.value.onopen = () => {
            console.log("Connected to the backend");
        };

        // On new data received
        websocket.value.onmessage = (msg) => {
            Object.assign(data, JSON.parse(msg.data));
            dataConnected.value = true;
        };

        // On close connection
        websocket.value.onclose = () => {
            console.log('Disconnected from backend');
        };
    
        // Error catch
        websocket.value.onerror = (error) => {
            console.error('Error has occurred:', error);
        };
    };

    // Update settings via message
    const updateSettings = (motorSpeedSetting=0, chargeStatus=0) => {
        if (websocket.value && websocket.value.readyState === WebSocket.OPEN) {
            websocket.value.send(JSON.stringify({
                motorSpeed: Number(motorSpeedSetting),
                chargeStatus: chargeStatus ? 1 : 0
            }));
        }
    }

    // Disconnect from backend
    const disconnect = () => {
        if (websocket.value) {
            websocket.value.close();
            dataConnected.value = false;
        }
    }

    // Disconnect from backend to stop backend calculations
    onUnmounted(disconnect);

    // Return functions as Vue composable
    return {
        data,
        dataConnected,
        connect,
        updateSettings,
        disconnect
    };
}