<!-- docs/.vitepress/components/math_envs/MathEnvBase.vue -->
<script setup lang="ts">
import { computed, useSlots, onMounted } from "vue"

onMounted(()=>{
    if (window.MathJax?.typesetPromise) {
        window.MathJax.typesetPromise();
    }
});

const props = defineProps<{
    title?: string
    envName: string
    collapsible?: boolean
}>()

const slots = useSlots()

const hasContent = computed(() => !!slots.default)
</script>

<template>
    <div class="math-env" :class="`math-env-${envName}`">
        <div class="math-env-header">
            <span class="math-env-name">{{ envName }}</span>
            <span v-if="title" class="math-env-title">({{ title }})</span>
        </div>

        <div v-if="hasContent" class="math-env-body">
            <slot />
        </div>

        <div v-else class="math-env-empty">
            ⚠ empty environment
        </div>
    </div>
</template>

<style scoped>
.math-env {
    border-left: 4px solid var(--vp-c-brand);
    padding: 0.6em 1em;
    margin: 1em 0;
    background: var(--vp-c-bg-soft);
    border-radius: 6px;
    font-size: 0.98em;
}

.math-env-header {
    font-weight: bold;
    margin-bottom: 0.4em;
}

.math-env-name {
    text-transform: capitalize;
    font-size: large;
}

.math-env-title {
    font-style: italic;
    font-family: "CMU Serif", serif;
    margin-left: 0.3em;
    font-size: large;
}

.math-env-title {
    font-family: "CMU Serif", serif;
}

.math-env-title {
    font-feature-settings: "kern" 1;
}

.math-env-title {
    font-family:
        "CMU Serif",
        "KaiTi",
        "楷体",
        serif;
}

.math-env-title {
    font-synthesis: none;
}

.math-env-body {
    line-height: 1.6;
}

.math-env-empty {
    opacity: 0.5;
    font-style: italic;
}
</style>