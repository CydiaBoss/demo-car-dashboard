import { ref, onUnmounted } from "vue";

const backend = ref("localhost:8000");

/**
 * Creates a composable interface for the backend connection
 * 
 * @returns composable version of websocket connection
 */
export function getDataChannel() {
    const data = ref({});
    const websocket = ref(null);

    // Connect to the backend websocket
    const connect = () => {
        websocket.value = new WebSocket(`ws://${backend.value}/data`);
        
        // On connect notification
        websocket.value.onopen = () => {
            console.log("Connected to the backend");
        };

        // On new data received
        websocket.value.onmessage = (msg) => {
            data.value = JSON.parse(msg.data);
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
                motorSpeed: motorSpeedSetting,
                chargeStatus: chargeStatus
            }));
        }
    }

    // Disconnect from backend
    const disconnect = () => {
        if (websocket.value) {
            websocket.value.close();
        }
    }

    onUnmounted(disconnect);

    // Return functions as Vue composable
    return {
        data,
        connect,
        updateSettings,
        disconnect
    };
}