<script setup>
const props = defineProps({
  parkingBreak: {
    type: Boolean,
    default: false,
  },
  checkEngine: {
    type: Boolean,
    default: false,
  },
  motorStatus: {
    type: Boolean,
    default: false,
  },
  lowBattery: {
    type: Boolean,
    default: false,
  }
});
</script>

<template>
  <div class="indicators">
    <div>
      <img class="indicator-icons" :class="{ disabled: !parkingBreak }" src="../assets/parkingbreak.png" alt="parking break indicator" />
    </div>
    <div>
      <img class="indicator-icons" :class="{ disabled: !checkEngine }" src="../assets/engine.png" alt="check engine indicator" />
    </div>
    <div>
      <img class="indicator-icons" :class="{ disabled: !motorStatus, 'make-red': motorStatus }" src="../assets/motor.png" alt="motor status indicator" />
    </div>
    <div>
      <img class="indicator-icons" :class="{ disabled: !lowBattery, 'make-red': lowBattery }" src="../assets/battery.png" alt="low battery indicator" />
    </div>
  </div>
</template>

<style scoped>
.indicators {
  height: 12.5vh;
  display: flex;
  justify-content: left;
  gap: 0.15rem;
  padding: 0.35rem;
  background-color: var(--vt-c-black);
  border-radius: 0.25em;
}
.indicators > div {
  height: 100%;
  margin: auto 0;
  padding: 0.35rem;
  border: 1px solid var(--vt-c-div-border);

}
.indicator-icons {
  height: 100%;
}
.make-red {
  /* Converts grey icons to red */
  filter: brightness(0) saturate(100%) invert(12%) sepia(88%) saturate(6338%) hue-rotate(0deg) brightness(103%) contrast(114%);
}
.disabled {
  /* Converts any icon into the background */
  filter: brightness(0) saturate(100%) invert(10%) sepia(0%) saturate(8%) hue-rotate(168deg) brightness(94%) contrast(95%);
}
</style>
