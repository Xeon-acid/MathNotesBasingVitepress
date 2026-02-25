<!-- docs/.vitepress/components/math_envs/Definition.vue -->
<script setup lang="ts">
import MathEnvBase from "./MathEnvBase.vue"

defineProps<{
    title?: string
}>()
</script>

<template>
    <MathEnvBase envName="Definition" :title="title">
        <slot />
    </MathEnvBase>
</template>