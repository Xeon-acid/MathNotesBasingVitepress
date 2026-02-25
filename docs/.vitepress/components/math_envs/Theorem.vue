<script setup lang="ts">
import MathEnvBase from "./MathEnvBase.vue"
defineProps<{ title?: string }>()
</script>

<template>
    <MathEnvBase envName="Theorem" :title="title">
        <slot />
    </MathEnvBase>
</template>