<script lang="ts">
    import { onMount } from "svelte";
    import { active, loaded } from "../stores";

    interface Coordinates {
        x: number,
        y: number
    };

    export let mouse: Coordinates;
    export let index: number;
    export let open: boolean;
    
    let rotator: HTMLImageElement;
    const center: Coordinates = { x: 0, y: 0 };

    function getCenter(): void {
        const rect = rotator.getBoundingClientRect();
        center.x = rect.left + rect.width / 2;
        center.y = rect.top + rect.height / 2;
    }

    const interval: number = 6 + index;

    let blink: boolean = false;
    function timer(seconds: number): void {
        setTimeout(() => {
            open = false; // Only open once
            blink = !blink;
            let t: number = Math.random() * interval;
            timer(t > 2 ? t : 3);
        }, seconds * 1000);
    }

    onMount(() => {
        $active++;
        timer(Math.random() * (interval - 3) + 3);
    });

    $: if ($loaded) getCenter();
    $: rotation = Math.atan2(mouse.y - center.y, mouse.x - center.x);
</script>

<div class:blink class:open>
    <img bind:this={rotator} src="/eye.svg" alt="Eye" style="--rotation: {rotation}rad;"/>
</div>

<style>
    img {
        transform: rotate(var(--rotation));
        height: 14vh;
    }

    div {
        display: inline;
        width: fit-content;
    }

    div.open {
        animation: open 1.4s linear;
    }

    @keyframes open {
        0% {
            clip-path: inset(50% 0);
        }
        
        40% {
            clip-path: inset(0);
        }
        
        65% {
            clip-path: inset(50% 0);
        }
        
        70% {
            clip-path: inset(0);
        }
        
        75% {
            clip-path: inset(50% 0);
        }
        
        80% {
            clip-path: inset(0);
        }

        100% {
            clip-path: inset(0);
        }
    }
    
    div.blink {
        animation: blink 1.5s linear;
    }

    @keyframes blink {
        0% {
            clip-path: inset(0);
        }
        
        50% {
            clip-path: inset(50% 0);
        }
        
        100% {
            clip-path: inset(0);
        }
    }
</style>
