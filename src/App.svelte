<script type="ts">
    import Eye from "./lib/eye.svelte";
    import { active, loaded } from "./stores";

    interface Coordinates {
        x: number,
        y: number
    };

    const point: Coordinates = { x: 0, y: 0 };
    
    // Unfortunatelly, I can't use the coordinate object
    // because Svelte doesn't allow it in the window binding
    let scrollX: number;
    let scrollY: number;
    
    const debbuger: HTMLParagraphElement = document.createElement("p");

    debbuger.style.position = "absolute";
    $: debbuger.style.top   = `${scrollY}px`;
    $: debbuger.style.left  = `${scrollX}px`;
    $: debbuger.innerText   = `X: ${point.x | 0} Y: ${point.y | 0}`;

    if (import.meta.env.PROD) {
        document.body.append(debbuger);
    }

    function handlePointermove(event: { clientX: number; clientY: number; }): void {
        point.x = event.clientX;
        point.y = event.clientY;
    }
    
    function handleMotion({ accelerationIncludingGravity: { x, y } }): void {
        // Normalize gravity, normalize (0:0) to top left corner, scale to the radius of the device size, add the scrolled distance
        point.x = (-x / 10 + 1) * screen.availWidth / 2 - scrollX;
        point.y = (y / 10 + 1) * screen.availHeight / 2 + scrollY;
    }

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

    const mouse: boolean = matchMedia('(pointer:fine)').matches;

    // If it has a mouse
    if (mouse) window.addEventListener("pointermove", handlePointermove);

    // If it doesn't have a mouse BUT has a gyroscope
    else if (DeviceMotionEvent) window.addEventListener("devicemotion", handleMotion);

    // Else non-supported device
    else document.body.innerText = "Your device isn't supported, sorry!";
</script>

<svelte:window on:resize={reload} bind:scrollX={scrollX} bind:scrollY={scrollY} />

{#if !mouse}
    <img src="/cursor.svg" alt="Eye" style="--top: {point.y}px; --left: {point.x}px" />
{/if}

<main>
    {#key trigger}
        <div>
            {#each Array(amount) as _, index}
                <Eye {point} {index} open={added && amount === index + 1} on:pop={less} />
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

    img {
        position: absolute;
        top: var(--top);
        left: var(--left);
        z-index: 999;
    }
</style>
