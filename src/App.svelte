<script type="ts">
    import Eye from "./lib/eye.svelte";
    import { active, loaded } from "./stores";

    interface Coordinates {
        x: number,
        y: number
    };

    const mouse: Coordinates = { x: 0, y: 0 };

    let blockMouse: boolean = false;
    function handleMousemove(event: { clientX: number; clientY: number; }): void {
        if (blockMouse) return;
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    }

    function handleTouchmove(event: { touches: { clientX: number; clientY: number; }[]; }): void {
        blockMouse = true;
        mouse.x = event.touches[0].clientX;
        mouse.y = event.touches[0].clientY;
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
</script>

<svelte:window on:resize={reload} />
<svelte:body on:mousemove={handleMousemove} on:touchmove={handleTouchmove} />

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
