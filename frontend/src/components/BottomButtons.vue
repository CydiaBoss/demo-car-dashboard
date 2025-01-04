<script setup>
import { ref } from 'vue';

// Props for the component
const props = defineProps({
  // Charge mode status
  chargeMode: {
    type: Boolean,
    default: false
  }
});

// Events to handle buttons
const emit = defineEmits([
  'click:gear', 
  'click:motor', 
  'click:batterytemp', 
  'click:menu', 
  'click:charge'
]);
</script>

<template>
  <div class="bottom-btns">
    <div class="ctrl-btns">
      <button @click="emit('click:gear')">
        <img src="../assets/gears.png" alt="gear button" />
      </button>
      <button @click="emit('click:motor')">
        <img src="../assets/motor.png" alt="motor button" />
      </button>
      <button @click="emit('click:batterytemp')">
        <img src="../assets/batterytemp.png" alt="battery temp button" />
      </button>
    </div>
    <div class="menu-btn">
      <button @click="emit('click:menu')">
        <img src="../assets/menu.png" alt="menu button" />
      </button>
    </div>
    <div class="charge-btn">
      <button @click="emit('click:charge')">
        <img :class="{ toggled: chargeMode }" src="../assets/charge.png" alt="charge button" />
      </button>
    </div>
  </div>
</template>

<style scoped>
button {
  height: 100%;
  border: none;
  cursor: pointer;
}
button:hover {
  filter: brightness(85%);
}
img {
  height: 100%;
  padding: 1em;
}
img:active {
  transform: scale(0.95);
}
.bottom-btns {
  height: 15vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.125rem;
  gap: 0.125rem;
  background-color: var(--vt-c-grey-1);
  border: 1.5px solid var(--vt-c-div-border);
  border-radius: 0.25em;
}
.ctrl-btns {
  width: 100%;
  display: flex;
  justify-content: left;
  background-color: var(--vt-c-grey-2);
  border-radius: 0.15em;
  padding: 0.15em;
}
.ctrl-btns > button {
  background-color: var(--vt-c-grey-2);
  border: 1.5px solid var(--vt-c-div-border);
}
.menu-btn {
  width: 12%;
  display: flex;
  justify-content: center;
}
.menu-btn > button {
  border-radius: 0.5em;
  background-color: var(--vt-c-grey-3);
  border: 1.5px solid var(--vt-c-div-border);
}
.charge-btn {
  width: 100%;
  display: flex;
  justify-content: right;
  background-color: var(--vt-c-grey-2);
  border-radius: 0.15em;
  padding: 0.15em;
}
.charge-btn > button {
  background-color: var(--vt-c-grey-2);
  border: 1.5px solid var(--vt-c-div-border);
}
.toggled {
  filter: brightness(0) saturate(100%) invert(38%) sepia(33%) saturate(7487%) hue-rotate(194deg) brightness(106%) contrast(103%);
}
</style>
