<template>
    <div class="border-t border-line bg-surface-2 px-5 py-4" @keydown.esc.stop="$emit('close')">
        <div v-if="loading" class="flex items-center gap-2 text-[13px] text-muted">
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" aria-hidden="true" />
            Loading shared text…
        </div>

        <p v-else-if="loadError" class="flex items-start gap-2 text-[13px] text-bad" role="alert">
            <TsnIcon name="alert" class="mt-0.5 h-4 w-4 shrink-0" stroke="2" />{{ loadError }}
        </p>

        <form v-else class="grid gap-4" @submit.prevent="save">
            <div class="flex flex-wrap items-baseline justify-between gap-3">
                <p class="text-[13px] text-muted">
                    Editing link <code class="font-mono font-semibold text-ink">{{ share.code }}</code>.
                    The link stays the same — anyone with it sees the new version.
                </p>
                <p class="text-[12px] text-muted">{{ text.length.toLocaleString("en-US") }} / 100,000</p>
            </div>

            <div>
                <label :for="`edit-text-${share.code}`" class="sr-only">Shared text</label>
                <textarea
                    :id="`edit-text-${share.code}`"
                    v-model="text"
                    rows="5"
                    maxlength="100000"
                    class="block w-full resize-none rounded-md border border-line bg-bg px-3 py-2 text-[14px] leading-relaxed text-ink placeholder:text-muted/70 !outline-none focus-visible:!ring-2 focus-visible:!ring-brand/40"
                />
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
                <div>
                    <label :for="`edit-expiry-${share.code}`" class="mb-1 block text-[12px] font-medium text-muted">New expiry</label>
                    <select :id="`edit-expiry-${share.code}`" v-model="ttl" class="w-full rounded-md border border-line bg-bg px-3 py-2 text-[13px] text-ink !outline-none">
                        <option v-for="o in EXPIRY_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
                    </select>
                </div>
                <div>
                    <label :for="`edit-reads-${share.code}`" class="mb-1 block text-[12px] font-medium text-muted">Allowed reads</label>
                    <select :id="`edit-reads-${share.code}`" v-model="maxReads" class="w-full rounded-md border border-line bg-bg px-3 py-2 text-[13px] text-ink !outline-none">
                        <option v-for="o in READ_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
                    </select>
                    <p class="mt-1 text-[12px] leading-4 text-muted">{{ readsNote }}</p>
                </div>
            </div>

            <div>
                <label :for="`edit-password-${share.code}`" class="mb-1 block text-[12px] font-medium text-muted">
                    Password{{ original?.passwordRequired ? " — leave blank to keep the current one" : " (optional)" }}
                </label>
                <div class="flex flex-wrap items-center gap-2">
                    <input
                        :id="`edit-password-${share.code}`"
                        v-model="password"
                        type="password"
                        autocomplete="new-password"
                        placeholder="Password"
                        class="min-w-0 flex-1 rounded-md border border-line bg-bg px-3 py-2 text-[13px] text-ink placeholder:text-muted/70 !outline-none"
                        @input="removePw = false"
                    />
                    <button v-if="original?.passwordRequired" type="button" class="btn-ghost !h-9 !px-3 text-[13px]" @click="removePw = true">
                        {{ removePw ? "Removing…" : "Remove password" }}
                    </button>
                </div>
                <p v-if="removePw" class="mt-1 text-[12px] text-muted">Save changes to remove the password from this link.</p>
            </div>

            <p v-if="error" class="flex items-start gap-2 text-[13px] text-bad" role="alert">
                <TsnIcon name="alert" class="mt-0.5 h-4 w-4 shrink-0" stroke="2" />{{ error }}
            </p>

            <div class="flex flex-wrap items-center justify-end gap-2">
                <button type="button" class="btn-ghost !h-9 !px-3 text-[13px]" @click="$emit('close')">Cancel</button>
                <button type="submit" class="btn-primary !h-9 !px-4 text-[13px]" :disabled="saving || !text.trim()">
                    {{ saving ? "Saving…" : "Save changes" }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { EXPIRY_OPTIONS } from "~/utils/expiry.js";
import { READ_OPTIONS } from "~/utils/reads.js";
import { hashPassword } from "~/utils/hash.js";

const props = defineProps({
    share: { type: Object, required: true },
});
const emit = defineEmits(["close", "saved"]);

const loading = ref(true);
const loadError = ref("");
const error = ref("");
const saving = ref(false);

const original = ref(null);
const text = ref("");
const ttl = ref(600);
const maxReads = ref(1);
const password = ref("");
const removePw = ref(false);

const readsNote = computed(() => {
    const used = original.value?.readsUsed;
    if (maxReads.value === 0) return "Unlimited — reads don't close this share.";
    if (used === null || used === undefined) return "Read count isn't tracked for this setting.";
    return `${used} read${used === 1 ? "" : "s"} used already — the total can't go below that.`;
});

onMounted(load);

async function load() {
    loading.value = true;
    loadError.value = "";
    try {
        const source = await $fetch(`/api/pro/shares/${encodeURIComponent(props.share.code)}`);
        if (!source.editable) {
            throw new Error("This share can't be edited from here.");
        }
        original.value = source;
        text.value = source.text || "";
        ttl.value = source.ttl === null ? 0 : Number(source.ttl);
        maxReads.value = Number(source.maxReads);
    } catch (e) {
        loadError.value = e?.data?.message || e?.message || "Could not load that share. Try again.";
    } finally {
        loading.value = false;
    }
}

async function save() {
    if (saving.value) return;
    error.value = "";
    const body = {};
    if (text.value.trim() !== (original.value?.text || "").trim()) {
        body.text = text.value.trim();
    }
    if (Number(ttl.value) !== (original.value?.ttl === null ? 0 : Number(original.value?.ttl))) {
        body.ttl = Number(ttl.value);
    }
    if (Number(maxReads.value) !== Number(original.value?.maxReads)) {
        body.maxReads = Number(maxReads.value);
    }

    const pwNow = original.value?.passwordRequired;
    if (removePw.value && pwNow) {
        body.passwordHash = null;
    } else if (password.value.trim()) {
        try {
            body.passwordHash = await hashPassword(password.value);
        } catch {
            error.value = "Could not hash that password. Use a private window and try again.";
            return;
        }
    }

    if (!Object.keys(body).length) {
        error.value = "Nothing changed.";
        return;
    }

    saving.value = true;
    try {
        const result = await $fetch(`/api/pro/shares/${encodeURIComponent(props.share.code)}`, {
            method: "PUT",
            body,
        });
        emit("saved", result.changed || []);
    } catch (e) {
        error.value = e?.data?.message || "Could not save those changes. Please try again.";
    } finally {
        saving.value = false;
    }
}
</script>
