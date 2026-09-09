<template>
    <header>
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

        <nav>
            <!-- <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/about">About</RouterLink> -->
        </nav>
    </header>

    <main class="page min-h-screen bg-slate-50 p-4">
        <RouterView />
    </main>
</template>

<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router';
</script>
