<script setup>
// Props from the parent component
const props = defineProps({
  gearRatio: {
    type: String,
    required: true,
    default: "N/A",
  },
  batteryPercent: {
    type: Number,
    required: true,
    default: NaN,
  },
  batteryTemp: {
    type: Number,
    required: true,
    default: NaN,
  },
  motorSpeed: {
    type: Number,
    required: true,
    default: NaN,
  },
});

// Derive motor speed setting from motor speed
const motorSpeedSetting = defineModel({
  required: true,
  default: 0
});
</script>

<template>
  <div class="middle-row">
    <div>
      <img class="middle-row-icon" src="../assets/gears.png" alt="gears" />
      {{ gearRatio }}
      <p class="unit">&#8203;</p>
    </div>
    <div>
      <img class="middle-row-icon" src="../assets/battery.png" alt="battery percentage" />
      {{ batteryPercent }}
      <p class="unit">%</p>
    </div>
    <div>
      <img class="middle-row-icon" src="../assets/batterytemp.png" alt="battery temperature" />
      {{ batteryTemp }}
      <p class="unit">°C</p>
    </div>
    <div>
      <img class="middle-row-icon" src="../assets/motor.png" alt="motor speed" />
      {{ Math.round(motorSpeed * 100)/100 }}
      <p class="unit">RPM</p>
    </div>
    <div class="motor-slider">
      <h2>MOTOR SPEED SETTING</h2>
      <input type="range" v-model="motorSpeedSetting" :min="0" :max="4" :step="1" list="motor-speeds" />
      <datalist class="ticks" id="motor-speeds">
        <option :value="0">OFF</option>
        <option :value="1">1</option>
        <option :value="2">2</option>
        <option :value="3">3</option>
        <option :value="4">4</option>
      </datalist>
    </div>
  </div>
</template>

<style scoped>
.middle-row {
  height: 20vh;
  display: flex;
  justify-content: left;
  padding: 0.25rem;
  background-color: var(--vt-c-black);
  border-radius: 0.25em;
}
.middle-row > div {
  height: 100%;
  width: 15%;
  min-width: max-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.8em;
  border: 1px solid var(--vt-c-div-border);
  padding: 1em;
}
.middle-row > div > * {
  margin: auto;
}
.middle-row-icon {
  height: 9vh;
}
.unit {
  font-size: 0.75em;
  color: var(--vt-c-grey-1);
}
.motor-slider {
  width: 40% !important;
}
.ticks {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80%;
}
.ticks > option {
  padding: 0;
  margin-top: -5px;
  color: white;
  font-size: 1.25em;
}
</style>
