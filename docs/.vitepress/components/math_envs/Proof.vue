<script setup lang="ts">
import MathEnvBase from "./MathEnvBase.vue"
defineProps<{ title?: string }>()
</script>

<template>
    <MathEnvBase envName="Proof" :title="title">
        <slot />
        <div class="qed">证毕</div>
    </MathEnvBase>
</template>

<style scoped>
.qed {
    text-align: right;
    font-weight: bold;
}
</style>