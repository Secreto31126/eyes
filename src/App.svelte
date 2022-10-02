<script type="ts">
    import Eye from "./lib/eye.svelte";
    import { active, loaded } from "./stores";

    interface Coordinates {
        x: number,
        y: number
    };

    const point: Coordinates = { x: 0, y: 0 };

    function handlePointermove(event: { clientX: number; clientY: number; }): void {
        point.x = event.clientX;
        point.y = event.clientY;
        debbuger.innerText = `${point.x} ${point.y}`;
    }
    
    const debbuger: HTMLParagraphElement = document.createElement("p");
    if (import.meta.env.PROD) {
        debbuger.style.position = "absolute";
        debbuger.style.top = "0";
        document.body.append(debbuger);
    }
    
    function handleMotion({ accelerationIncludingGravity: { x, y } }): void {
        point.x = -(x + Math.sign(x) * screen.width / 2);
        point.y = -(y + Math.sign(y) * screen.height / 2);
        debbuger.innerText = `${point.x} ${point.y}`;
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

    // If it has a mouse
    if (matchMedia('(pointer:fine)').matches) window.addEventListener("pointermove", handlePointermove);

    // If it doesn't have a mouse BUT has a gyroscope
    else if (DeviceMotionEvent) window.addEventListener("devicemotion", handleMotion);

    // Else non-supported device
    else document.body.innerText = "Your device isn't supported, sorry!";
</script>

<svelte:window on:resize={reload} />

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
</style>
