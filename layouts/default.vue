<template>
    <div class="flex min-h-screen flex-col bg-bg font-sans text-[16px] leading-normal text-ink">
        <a
            href="#main"
            class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-on-brand"
        >Skip to content</a>
        <AppHeader />
        <main id="main" class="flex-1">
            <slot />
        </main>
        <AppFooter />
    </div>
</template>
