<script lang="ts">
    import { onMount, createEventDispatcher } from "svelte";
    import { active, loaded } from "../stores";

    interface Coordinates {
        x: number,
        y: number
    };

    export let point: Coordinates;
    export let index: number;
    export let open: boolean;
    
    const dispatch = createEventDispatcher();
    
    let rotator: HTMLImageElement;
    const center: Coordinates = { x: 0, y: 0 };

    let disabled: boolean = true;
    function getCenter(): void {
        const rect = rotator.getBoundingClientRect();
        center.x = rect.left + rect.width / 2;
        center.y = rect.top + rect.height / 2;

        // Prevent accidental pops
        setTimeout(() => disabled = false, 1400);
    }

    const interval: number = 16 + index;

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
    $: rotation = Math.atan2(point.y - center.y, point.x - center.x);

    let plop: boolean = false;
    function pop(): void {
        if (disabled) return;
        else disabled = true;
        plop = true;
        setTimeout(() => {
            dispatch("pop");
        }, 100);
    }
</script>

<div class:blink class:open class:plop>
    <img bind:this={rotator} on:click={pop} src="/eye.svg" alt="Eye" style="--rotation: {rotation}rad;"/>
</div>

<style>
    img {
        transform: rotate(var(--rotation));
        height: 14vh;
    }

    div {
        display: inline;
        width: fit-content;
        transition: scale 0.1s linear;
    }

    div.plop {
        scale: 1.5;
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
        animation: blink 0.5s linear;
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
