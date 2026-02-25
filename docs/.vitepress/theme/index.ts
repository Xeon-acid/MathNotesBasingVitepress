import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { applyTexLayout } from "./tex-layout/applyTexLayout";
import { onMounted, watch } from "vue";
import { useRoute } from "vitepress";
import "./style.css";
import "./font-face.css";

import Definition from "../components/math_envs/Definition.vue";
import Theorem from "../components/math_envs/Theorem.vue";
import Lemma from "../components/math_envs/Lemma.vue";
import Proof from "../components/math_envs/Proof.vue";
import Axiom from "../components/math_envs/Axiom.vue";

export default {
    extends: DefaultTheme,

    enhanceApp({ app }) {
        app.component("Definition", Definition);
        app.component("Theorem", Theorem);
        app.component("Lemma", Lemma);
        app.component("Proof", Proof);
        app.component("Axiom", Axiom);
    },
    setup() {
        const route = useRoute();

        onMounted(() => {
            applyTexLayout();
        });

        watch(
            () => route.path,
            () => {
                requestAnimationFrame(() => applyTexLayout());
            },
        );
    },
} satisfies Theme;
