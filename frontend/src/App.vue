<script setup>
import Indicators from './components/Indicators.vue';
import Gauges from './components/Gauges.vue';
import MiddleRow from './components/MiddleRow.vue';
import BottomButtons from './components/BottomButtons.vue';

import { ref, watch } from 'vue';
import { getDataChannel } from './composables/datachannel';

// Data Channel Setup
const { data, dataConnected, connect, updateSettings } = getDataChannel();
connect(); // Connect to the backend via websocket

// Local values
const motorSpeedSetting = ref(0);
const charging = ref(false);

/**
 * Listener for motor speed slider change
 * 
 * @param newValue new value of the slider
 * @param oldValue old value of the slider
 */
function onMotorSpeedChange(newValue, oldValue) {
  // Desired motor speed
  motorSpeedSetting.value = newValue;
  
  // Update Backend
  updateSettings(motorSpeedSetting.value, charging.value);
}

/**
 * Listener for charger button change
 */
function onChargeButtonToggle() {
  // Desired motor speed
  charging.value = !charging.value;
  
  // Update Backend
  updateSettings(motorSpeedSetting.value, charging.value);
}

// Update upon first connect only
watch(dataConnected, (newValue, oldValue) => {
  if(newValue) {
    motorSpeedSetting.value = data.motorSettings.MotorSpeed;
    charging.value = data.motorSettings.ChargeMode == 1;
  }
});
</script>

<template>
  <Indicators 
    :parking-break="data.indicators.ParkingBreak == 1" 
    :check-engine="data.indicators.CheckEngine == 1" 
    :motor-status="data.indicators.MotorStatus == 1" 
    :low-battery="data.indicators.LowBattery == 1" 
  />
  <Gauges 
    :power="data.motorData.MotorPower" 
    :speed="data.motorData.MotorSpeed" 
  />
  <MiddleRow 
    v-model="motorSpeedSetting"
    @update:modelValue="onMotorSpeedChange" 
    :gear-ratio="data.motorData.GearRatio" 
    :battery-percent="data.motorData.BatteryLevel" 
    :battery-temp="data.motorData.BatteryTemp" 
    :motor-speed="data.motorData.MotorSpeed" 
    :init-motor-speed-setting="motorSpeedSetting"
  />
  <BottomButtons 
    @click:charge="onChargeButtonToggle" 
    :charge-mode="charging" 
  />
</template>

<style scoped></style>
