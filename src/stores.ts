import { writable } from 'svelte/store';

export const active = writable(0);
export const loaded = writable(false);
