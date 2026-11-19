<!--
  Journey (Mediavine) ad slot.

  Journey fills any element matching a selector registered in its dashboard
  with a real ad. Every slot below shares ONE class name — `journey-ad-slot`
  (register that selector once to cover them all) — plus a modifier
  `journey-ad-slot--<position>` so a single placement can be targeted on its
  own, and `data-ad-position` for easy inspection in DevTools.

  The slot renders as a completely EMPTY div on purpose:
   - empty = zero height, so nothing looks broken (no blank gap) before the
     selector is registered in Journey or if Journey skips a placement;
   - no children at all, so Journey's script sees a clean container to
     inject into and can measure its full column width.

  Pro users never see slots — per the Terms, ads are part of the free plan.
-->
<template>
    <div
        v-if="!isPro"
        class="journey-ad-slot"
        :class="`journey-ad-slot--${position}`"
        :data-ad-position="position"
    />
</template>

<script setup>
defineProps({
    // Placement key, e.g. "below-tool". Becomes part of the CSS class so each
    // slot can also be targeted as .journey-ad-slot--below-tool.
    position: { type: String, default: "default" },
});

const { isPro } = usePremium();
</script>
