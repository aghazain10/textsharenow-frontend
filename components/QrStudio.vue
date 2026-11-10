<template>
    <div class="tool-glow rounded-2xl border border-line bg-surface p-3 text-left sm:p-4">
        <div class="mb-3 flex items-center justify-between gap-3 border-b border-line px-1 pb-3">
            <p class="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[-0.01em]">
                <TsnIcon name="qr" class="h-4 w-4" stroke="1.9" />QR code generator
            </p>
            <span class="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
                <i class="live-dot" aria-hidden="true" />Runs locally
            </span>
        </div>

        <div class="grid grid-cols-2 gap-1 rounded-lg bg-surface-2 p-1 sm:grid-cols-4" role="tablist" aria-label="QR code type">
            <button
                v-for="t in TABS"
                :id="`qr-tab-${t.id}`"
                :key="t.id"
                type="button"
                role="tab"
                :aria-selected="tab === t.id"
                :aria-controls="`qr-panel-${t.id}`"
                class="inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors sm:text-[14px]"
                :class="tab === t.id ? 'bg-surface text-ink shadow-card' : 'text-muted hover:text-ink'"
                @click="tab = t.id"
            >
                <TsnIcon :name="t.icon" class="h-4 w-4" stroke="1.9" />{{ t.label }}
            </button>
        </div>

        <div class="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
            <!-- Form -->
            <div class="min-w-0">
                <div
                    v-show="tab === 'text'"
                    id="qr-panel-text"
                    role="tabpanel"
                    aria-labelledby="qr-tab-text"
                >
                    <label for="qr-text" class="field-label">Link or text</label>
                    <textarea
                        id="qr-text"
                        v-model="text"
                        rows="6"
                        class="field resize-none"
                        placeholder="https://example.com/menu&#10;or any text you want the code to contain"
                    />
                    <p class="mt-2 text-[12px] leading-relaxed text-muted">
                        A URL opens directly in the scanner. Plain text appears on screen. Static codes encode the data itself, so they never expire.
                    </p>
                </div>

                <div
                    v-show="tab === 'wifi'"
                    id="qr-panel-wifi"
                    role="tabpanel"
                    aria-labelledby="qr-tab-wifi"
                >
                    <div class="grid gap-3 sm:grid-cols-2">
                        <label class="sm:col-span-2">
                            <span class="field-label">Network name (SSID) <span class="text-ink" aria-hidden="true">*</span></span>
                            <input v-model="wifi.ssid" type="text" class="field" placeholder="Cafe Guest" autocomplete="off" />
                        </label>

                        <label>
                            <span class="field-label">Security</span>
                            <select v-model="wifi.security" class="field">
                                <option value="WPA">WPA / WPA2 / WPA3</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">Open — no password</option>
                            </select>
                        </label>

                        <div v-if="wifi.security !== 'nopass'">
                            <label for="qr-wifi-password" class="field-label">Password <span class="text-ink" aria-hidden="true">*</span></label>
                            <div class="flex gap-2">
                                <input
                                    id="qr-wifi-password"
                                    v-model="wifi.password"
                                    :type="showWifiPassword ? 'text' : 'password'"
                                    class="field"
                                    placeholder="Network password"
                                    autocomplete="off"
                                />
                                <button type="button" class="btn-ghost !h-[38px] shrink-0 !px-3 text-[12px]" @click="showWifiPassword = !showWifiPassword">
                                    {{ showWifiPassword ? "Hide" : "Show" }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <label class="mt-3 inline-flex cursor-pointer items-center gap-2 text-[13px] text-muted">
                        <input v-model="wifi.hidden" type="checkbox" class="h-4 w-4 rounded border-line accent-ink" />
                        Hidden network
                    </label>

                    <p class="mt-3 text-[12px] leading-relaxed text-muted">
                        Anyone who scans this code can join the network — the password is inside the QR. Test it on another device before printing it.
                    </p>
                </div>

                <div
                    v-show="tab === 'contact'"
                    id="qr-panel-contact"
                    role="tabpanel"
                    aria-labelledby="qr-tab-contact"
                >
                    <div class="grid gap-3 sm:grid-cols-2">
                        <label>
                            <span class="field-label">First name</span>
                            <input v-model="contact.firstName" type="text" class="field" placeholder="Alex" autocomplete="off" />
                        </label>
                        <label>
                            <span class="field-label">Last name</span>
                            <input v-model="contact.lastName" type="text" class="field" placeholder="Rivera" autocomplete="off" />
                        </label>
                        <label>
                            <span class="field-label">Organization</span>
                            <input v-model="contact.org" type="text" class="field" placeholder="Northwind Studio" autocomplete="off" />
                        </label>
                        <label>
                            <span class="field-label">Job title</span>
                            <input v-model="contact.title" type="text" class="field" placeholder="Founder" autocomplete="off" />
                        </label>
                        <label>
                            <span class="field-label">Phone</span>
                            <input v-model="contact.phone" type="tel" class="field" placeholder="+1 555 000 1234" autocomplete="off" />
                        </label>
                        <label>
                            <span class="field-label">Email</span>
                            <input v-model="contact.email" type="email" class="field" placeholder="alex@example.com" autocomplete="off" />
                        </label>
                        <label class="sm:col-span-2">
                            <span class="field-label">Website</span>
                            <input v-model="contact.url" type="url" class="field" placeholder="https://example.com" autocomplete="off" />
                        </label>
                    </div>
                    <p class="mt-2 text-[12px] leading-relaxed text-muted">
                        Scanning saves a contact card (vCard) to the phone. Add at least a name or organization.
                    </p>
                </div>

                <div
                    v-show="tab === 'message'"
                    id="qr-panel-message"
                    role="tabpanel"
                    aria-labelledby="qr-tab-message"
                >
                    <div class="grid gap-3">
                        <label>
                            <span class="field-label">Action</span>
                            <select v-model="message.channel" class="field">
                                <option value="email">Send an email</option>
                                <option value="sms">Send an SMS</option>
                                <option value="whatsapp">Open a WhatsApp chat</option>
                                <option value="phone">Call a number</option>
                            </select>
                        </label>

                        <label v-if="message.channel === 'email'">
                            <span class="field-label">To <span class="text-ink" aria-hidden="true">*</span></span>
                            <input v-model="message.email" type="email" class="field" placeholder="hello@example.com" autocomplete="off" />
                        </label>
                        <label v-else>
                            <span class="field-label">Phone number <span class="text-ink" aria-hidden="true">*</span></span>
                            <input v-model="message.phone" type="tel" class="field" placeholder="+1 555 000 1234" autocomplete="off" />
                        </label>

                        <template v-if="message.channel === 'email'">
                            <label>
                                <span class="field-label">Subject</span>
                                <input v-model="message.subject" type="text" class="field" placeholder="Hello from the QR code" autocomplete="off" />
                            </label>
                            <label>
                                <span class="field-label">Message</span>
                                <textarea v-model="message.body" rows="4" class="field resize-none" placeholder="Optional pre-filled message" />
                            </label>
                        </template>

                        <label v-else-if="message.channel !== 'phone'">
                            <span class="field-label">Message</span>
                            <textarea v-model="message.body" rows="4" class="field resize-none" placeholder="Optional pre-filled message" />
                        </label>
                    </div>
                    <p class="mt-2 text-[12px] leading-relaxed text-muted">
                        The scanner opens the chosen app with the message or number already filled in. Nothing is sent automatically.
                    </p>
                </div>
            </div>

            <!-- Preview -->
            <aside class="flex flex-col rounded-xl border border-line bg-bg p-4">
                <div class="flex items-center justify-between gap-2">
                    <p class="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">Preview</p>
                    <span v-if="qr.ok" class="text-[11px] text-muted">{{ payload.length.toLocaleString("en-US") }} chars</span>
                </div>

                <div v-if="qr.ok" class="mt-3 flex flex-1 items-center justify-center">
                    <div
                        class="w-full max-w-[232px] rounded-lg bg-white p-2 [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
                        v-html="qr.svg"
                    />
                </div>
                <div v-else class="mt-3 flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-line px-4 py-10 text-center">
                    <TsnIcon name="qr" class="h-8 w-8 text-muted" stroke="1.6" />
                    <p class="mt-3 text-[13px] leading-relaxed text-muted">
                        {{ qr.reason === "long" ? "That is too much data for one QR code. Shorten the text." : "Fill in the fields to see the QR code." }}
                    </p>
                </div>

                <div class="mt-4 grid gap-2">
                    <label class="flex items-center justify-between gap-2 text-[12px] text-muted">
                        Download size
                        <select v-model.number="pngSize" class="rounded-md border border-line bg-bg px-2 py-1 text-[12px] text-ink !outline-none">
                            <option :value="512">512 px</option>
                            <option :value="1024">1024 px</option>
                            <option :value="2048">2048 px</option>
                        </select>
                    </label>
                    <button type="button" class="btn-primary w-full" :disabled="!qr.ok" @click="download('png')">
                        <TsnIcon name="download" class="h-4 w-4" stroke="1.9" />Download PNG
                    </button>
                    <button type="button" class="btn-ghost w-full" :disabled="!qr.ok" @click="download('svg')">
                        Download SVG
                    </button>
                    <p class="text-[11px] leading-relaxed text-muted">
                        SVG stays sharp at any print size. PNG is ready for screens, slides and chat.
                    </p>
                    <p v-if="notice" class="text-[12px] text-ok" role="status">{{ notice }}</p>
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup>
import { trackToolComplete, trackToolView } from "~/composables/useAnalytics.js";
import {
    createQr,
    downloadBlob,
    messagePayload,
    qrOutputSize,
    qrPngBlob,
    qrPreviewSvg,
    qrSvg,
    vcardPayload,
    wifiPayload,
} from "~/utils/qrGenerator.js";

const TABS = [
    { id: "text", label: "Link / text", icon: "link" },
    { id: "wifi", label: "Wi-Fi", icon: "wifi" },
    { id: "contact", label: "Contact", icon: "user" },
    { id: "message", label: "Message", icon: "mail" },
];

const tab = ref("text");
const showWifiPassword = ref(false);
const notice = ref("");
const pngSize = ref(1024);

const text = ref("");
const wifi = reactive({ ssid: "", password: "", security: "WPA", hidden: false });
const contact = reactive({ firstName: "", lastName: "", org: "", title: "", phone: "", email: "", url: "" });
const message = reactive({ channel: "email", email: "", phone: "", subject: "", body: "" });

const hasContact = computed(() =>
    [contact.firstName, contact.lastName, contact.org].some((value) => value.trim()),
);

const payload = computed(() => {
    if (tab.value === "text") return text.value.trim();
    if (tab.value === "wifi") {
        if (!wifi.ssid.trim()) return "";
        if (wifi.security !== "nopass" && !wifi.password) return "";
        return wifiPayload(wifi);
    }
    if (tab.value === "contact") {
        return hasContact.value ? vcardPayload(contact) : "";
    }
    if (tab.value === "message") {
        if (message.channel === "email") {
            return message.email.trim() ? messagePayload({ ...message, phone: "" }) : "";
        }
        return message.phone.trim() ? messagePayload({ ...message, email: "" }) : "";
    }
    return "";
});

const previewTitle = computed(
    () => `${TABS.find((item) => item.id === tab.value)?.label || "QR code"} preview`,
);

const qr = computed(() => {
    if (!payload.value) return { ok: false, reason: "empty", svg: "", qr: null };
    try {
        const value = createQr(payload.value);
        return { ok: true, reason: "", svg: qrPreviewSvg(value, previewTitle.value), qr: value };
    } catch {
        return { ok: false, reason: "long", svg: "", qr: null };
    }
});

const outputSize = computed(() => (qr.value.ok ? qrOutputSize(qr.value.qr, pngSize.value) : 0));

watch(payload, () => {
    notice.value = "";
});

watch(tab, () => {
    notice.value = "";
});

onMounted(() => trackToolView("qr-code-generator"));

async function download(format) {
    const entry = qr.value;
    if (!entry.ok || !entry.qr) return;

    try {
        const base = `textsharenow-qr-${tab.value}`;
        if (format === "svg") {
            const svg = qrSvg(entry.qr, pngSize.value, `${previewTitle.value} QR code`);
            downloadBlob(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), `${base}.svg`);
        } else {
            const blob = await qrPngBlob(entry.qr, pngSize.value);
            downloadBlob(blob, `${base}.png`);
        }
        notice.value = `Saved ${format.toUpperCase()} · ${outputSize.value} × ${outputSize.value} px`;
        trackToolComplete("qr-code-generator", { type: tab.value, format, size: pngSize.value });
    } catch {
        notice.value = "Could not create that file. Try a smaller size.";
    }
}
</script>
