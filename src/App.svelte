<script type="ts">
    import Eye from "./lib/eye.svelte";
    import { active, loaded } from "./stores";

    interface Coordinates {
        x: number,
        y: number
    };

    const mouse: Coordinates = { x: 0, y: 0 };

    function handlePointermove(event: { clientX: number; clientY: number; }): void {
        window.removeEventListener("deviceorientation", handleOrientation);

        mouse.x = event.clientX;
        mouse.y = event.clientY;
    }
    
    function handleOrientation({ alpha, beta, gamma }): void {
        if (alpha !== null && beta !== null && gamma !== null) {
            document.body.innerHTML = `X: ${beta}\nY: ${gamma}\nZ: ${alpha}`;
            mouse.x = beta;
            mouse.y = gamma;
        } else {
            // If any of the parameters is missing, assume as non available
            window.removeEventListener("deviceorientation", handleOrientation);
        }
    }

    if (DeviceMotionEvent) window.addEventListener("deviceorientation", handleOrientation);

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
