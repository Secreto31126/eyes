<script lang="ts">
    import { onMount } from "svelte";
    import { active, loaded } from "../stores";

    interface Coordinates {
        x: number,
        y: number
    };

    export let mouse: Coordinates;
    
    let rotator: HTMLImageElement;
    const center: Coordinates = { x: 0, y: 0 };

    function getCenter(): void {
        const rect = rotator.getBoundingClientRect();
        center.x = rect.left + rect.width / 2;
        center.y = rect.top + rect.height / 2;
        console.log(center);
    }

    onMount(() => {
        $active++;
    });
    
    $: if ($loaded) getCenter();
    $: rotation = Math.atan2(mouse.y - center.y, mouse.x - center.x);
</script>

<img bind:this={rotator} src="/eye.svg" alt="Eye" style="--rotation: {rotation}rad;"/>

<style>
    img {
        transform: rotate(var(--rotation));
        height: 14vh;
    }
</style>
