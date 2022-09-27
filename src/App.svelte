<script type="ts">
    import Eye from "./lib/eye.svelte";
    import { active, loaded } from "./stores";

    interface Coordinates {
        x: number,
        y: number
    };

    const mouse: Coordinates = { x: 0, y: 0 };
    function handleMousemove(event: { clientX: number; clientY: number; }): void {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    }

    let trigger = false;
    function reload(): void {
        trigger = !trigger;
        $loaded = false;
        $active = 0;
    }

    let amount = 0;
    function more(): void {
        amount++;
        reload();
    }

    $: if (amount === $active) $loaded = true;
</script>

<svelte:window on:resize={reload} />
<svelte:body on:mousemove={handleMousemove} />

<main>
    {#key trigger}
        <div>
            {#each Array(amount) as _}
                <Eye {mouse} />
            {/each}
        </div>
    {/key}
    <button on:click={more}>{amount ? "More" : "Eye"}</button>
</main>

<style>
    :global(*) {
        cursor: url("/cursor.svg"), auto;
    }
</style>
