<script setup>
// Props from parent component
const props = defineProps({
  // The power of the motor
  power: {
    type: Number,
    default: 0,
  },
  // The speed of the motor
  speed: {
    type: Number,
    default: 0,
  },
  // The size of the guages
  size: {
    type: Number,
    default: 400,
  }
});
</script>

<template>
  <!-- The guages are made using the canvas-guage module with a lot of customizations -->
  <div class="guages">
    <!-- Power Guage Setup -->
    <canvas
      id="power-gauge"
      data-type="radial-gauge"
      data-units="kW"
      :data-value="power"
      :data-height="size"
      :data-width="size"

      data-min-value="-1000"
      data-max-value="1000"
      data-value-int="1"
      data-value-dec="0"
      data-major-ticks="-1000,-750,-500,-250,0,250,500,750,1000"
      data-minor-ticks="0"
      data-highlights="[]"

      data-animation="false"

      data-border-inner-width="5"
      data-border-middle-width="10"
      data-border-outer-width="5"
      data-needle-width="2"
      data-needle-shadow="false"
      data-needle-circle-outer="false"
      data-needle-circle-inner="false"

      data-color-value-box-rect="#484848"
      data-color-value-box-rect-end="#484848"
      data-color-value-box-background="#484848"
      data-color-value-box-shadow="#484848"
      data-color-value-text="#ffffff"
      data-color-needle="#b2b2b2"
      data-color-needle-end="#b2b2b2"
      data-color-plate="#484848"
      data-color-units="#8b8b88"
      data-color-numbers="#8b8b88"
      data-color-major-ticks="#8b8b88"
      data-color-border-outer="#181818"
      data-color-border-outer-end="#191919"
      data-color-border-middle="#6f6f6f"
      data-color-border-middle-end="#656565"
      data-color-border-inner="#363736"
      data-color-border-inner-end="#191919"
    />
    <!-- Speed Guage Setup -->
    <canvas
      id="speed-gauge"
      data-type="radial-gauge"
      data-units="RPM"
      :data-value="speed"
      :data-height="size"
      :data-width="size"
      
      data-min-value="0"
      data-max-value="800"
      data-value-int="1"
      data-value-dec="0"
      data-major-ticks="0,100,200,300,400,500,600,700,800"
      data-minor-ticks="0"
      data-highlights="[]"

      data-animation="false"

      data-border-inner-width="5"
      data-border-middle-width="10"
      data-border-outer-width="5"
      data-needle-width="2"
      data-needle-shadow="false"
      data-needle-circle-outer="false"
      data-needle-circle-inner="false"
      
      data-color-value-box-rect="#484848"
      data-color-value-box-rect-end="#484848"
      data-color-value-box-background="#484848"
      data-color-value-box-shadow="#484848"
      data-color-value-text="#ffffff"
      data-color-needle="#b2b2b2"
      data-color-needle-end="#b2b2b2"
      data-color-plate="#484848"
      data-color-units="#8b8b88"
      data-color-numbers="#8b8b88"
      data-color-major-ticks="#8b8b88"
      data-color-border-outer="#181818"
      data-color-border-outer-end="#191919"
      data-color-border-middle="#6f6f6f"
      data-color-border-middle-end="#656565"
      data-color-border-inner="#363736"
      data-color-border-inner-end="#191919"
    />
  </div>
</template>

<style scoped>
.guages {
  height: 50vh; 
  min-height: 15em;
  display: flex;
  justify-content: space-around; 
  padding: 0.25rem;
  background-color: var(--vt-c-grey-4);
  border-radius: 0.25em;
}
.guages > canvas {
  margin: auto 0; 
  padding: 0;
}
</style>
