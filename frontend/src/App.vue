<script setup>
import Indicators from './components/Indicators.vue';
import Gauges from './components/Gauges.vue';
import MiddleRow from './components/MiddleRow.vue';
import BottomButtons from './components/BottomButtons.vue';

import { ref } from 'vue';

// Indicator controls
const parkingBreak = ref(false);
const checkEngine = ref(false);
const motorStatus = ref(false);
const lowBattery = ref(false);

// Constant values
const threshold = 0.001;

// Device values
const gearRatio = ref("1/2");
const batteryPercent = ref(100);
const batteryTemp = ref(25);
const motorSpeed = ref(0);
const motorPower = ref(0);
const charging = ref(false);

// Simulation values
const motorSpeedTarget = ref(0);

/**
 * Listener for motor speed slider change
 * 
 * @param newValue new value of the slider
 * @param oldValue old value of the slider
 */
function onMotorSpeedChange(newValue, oldValue) {
  // Desired motor speed
  motorSpeedTarget.value = newValue * 200;
}

/**
 * Listener for charger button change
 */
 function onChargeButtonToggle() {
  // Desired motor speed
  charging.value = !charging.value;
}

// Simulation delays
setInterval(() => {
  // Calculate delta change
  let deltachange = (motorSpeedTarget.value - motorSpeed.value)/100;

  // Update motor speed
  if (Math.abs(deltachange) > threshold) {
    motorSpeed.value += deltachange;
  }

  // Update motor power
  motorPower.value = motorSpeed.value * 1.25; // P = F * V (random math)

  // Indicator updates
  parkingBreak.value = Math.floor(motorSpeed.value) == 0;
  motorStatus.value = motorSpeed.value > 700;
  lowBattery.value = batteryPercent.value < 20;
}, 2);
</script>

<template>
  <Indicators :parking-break="parkingBreak" :check-engine="checkEngine" :motor-status="motorStatus" :low-battery="lowBattery"/>
  <Gauges :power="motorPower" :speed="motorSpeed" />
  <MiddleRow @update:motor-speed="onMotorSpeedChange" :gear-ratio="gearRatio" :battery-percent="batteryPercent" :battery-temp="batteryTemp" :motor-speed="motorSpeed"/>
  <BottomButtons :charge-mode="charging" @click:charge="onChargeButtonToggle"/>
</template>

<style scoped></style>
