<nav>
    <a id="logo" href="/">
        <h1>Safka <br/> Online.</h1>
    </a>
    <button>Settings</button>
</nav>
<main>
    <slot/>
</main>
<footer>
    <ul>
        <li><a href="/">Source Code</a></li>
        <li><a href="/">API</a></li>
    </ul>
</footer>


<style lang="scss">
    @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700;800;900&family=Montserrat:wght@700&display=swap');
    :global(:root) {
        --primary: #ff3535;
        --primary-variant: #ca2e2e;
        --on-primary: #fff;
        --background: #f3f3f3;
        --on-background-slight: #6e6e6e;
        --on-background: #000;
        --on-background-header: #262c30;
        --surface: #e9e9e9;
        --surface-variant: #d4d4d4;
        --on-surface: #000;
        --on-surface-header: #262c30;
        --text-selection-foreground: #fff;
        --text-selection-background: #ff6767;
        --tooltip-background: #4a4a4a;
    }

    :global(body) {
        margin: 0;
        
        width: 100vw;
        height: 100vh;
        
        font-family: "Lexend", sans-serif;

        background-color: var(--background);
        color: var(--on-background);

        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    :global(button) {
        display: inline-block;
        border: none;
        outline: none;
        cursor: pointer;

        font-family: "Lexend", sans-serif;

        padding: 8px;
        border-radius: 8px;
    }

    #logo {
        font-family: "Montserrat", sans-serif;
        font-weight: 700;
        text-decoration: none;
        user-select: none;
        margin: 0;

        color: var(--primary);

        h1 {
            font-size: 2em;
            margin: 0;
        }
    }

    nav {
        display: flex;
        justify-content: space-between;
        margin: 16px;
    }

    main {
        margin: 0 16px;
        flex: 1;
    }

    footer {
        display: flex;
        justify-content: center;
        align-items: center;

        margin-top: 16px;
        padding: 16px;
        box-sizing: border-box;

        background-color: var(--primary);

        ul {
            padding: 0;
            margin: 0;
        }

        li {
            display: inline-block;
            list-style-type: none;
            width: fit-content;
            user-select: none;
            cursor: pointer;

            margin: 0 8px;
            padding: 8px;

            a {
                text-decoration: none;
                color: var(--on-primary);
            }

            &:hover {
                background-color: var(--primary-variant);
            }
        }
    }
</style>