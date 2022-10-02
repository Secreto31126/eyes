<script type="ts">
    import Eye from "./lib/eye.svelte";
    import { active, loaded } from "./stores";

    interface Coordinates {
        x: number,
        y: number
    };

    const mouse: Coordinates = { x: 0, y: 0 };

    function handlePointermove(event: { clientX: number; clientY: number; }): void {
        // window.removeEventListener("devicemotion", handleMotion);

        mouse.x = event.clientX;
        mouse.y = event.clientY;
    }
    
    function handleMotion({ accelerationIncludingGravity: { x, y } }): void {
        // If any of the parameters is missing, assume as non available
        if (x === null || y === null) {
            window.removeEventListener("devicemotion", handleMotion);
            return;
        }

        mouse.x = -x;
        mouse.y = -y;
    }

    if (DeviceMotionEvent) window.addEventListener("devicemotion", handleMotion);

    let trigger: boolean = false;
    function reload(): void {
        trigger = !trigger;
        $loaded = false;
        $active = 0;
    }

    let amount: number = 0;
    let added: boolean = false;

    function more(): void {
        added = true;
        amount++;
        reload();
    }
    
    function less(): void {
        added = false;
        amount--;
        reload();
    }

    $: if (amount === $active) $loaded = true;
</script>

<svelte:window on:resize={reload} on:pointermove={handlePointermove} />

<main>
    {#key trigger}
        <div>
            {#each Array(amount) as _, index}
                <Eye {mouse} {index} open={added && amount === index + 1} on:pop={less} />
            {/each}
        </div>
    {/key}
    <button on:click={more}>{amount ? "More" : "Eye"}</button>
</main>

<style>
    :global(*) {
        cursor: url("/cursor.svg"), auto;
    }

    div {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>
