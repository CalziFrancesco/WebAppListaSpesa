<script>
    import { datiCondivisi } from '$lib/stores.js';
    import Card from '$lib/Card.svelte';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    
    let articoli = [];
    let loading = false;
    let error = null;
    let highlightedProductId = null;
    let pagina = "corridoi"
    
    const categoria = $datiCondivisi.cat;
    const searchedProduct = $datiCondivisi.searchedProduct;
    
    // Funzione per tornare alla home
    function goToHome() {
        goto('/home');
    }
    
    async function fetchArticoli(categoria) {
        loading = true;
        error = null;
        articoli = [];
        
        try {
            const res = await fetch(`https://backendls-1.onrender.com/articoli/categoria/${categoria}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            });
           
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                
                if (Array.isArray(data)) {
                    data.forEach(articolo => {
                        articoli = [...articoli, articolo];
                    });
                    console.log(`Caricati ${articoli.length} articoli per la categoria: ${categoria}`);
                    
                    if (searchedProduct) {
                        highlightedProductId = searchedProduct._id || searchedProduct.Id_art;
                        setTimeout(() => {
                            scrollToHighlightedProduct();
                        }, 100);
                    }
                } else {
                    error = "Formato dati non valido - expected array";
                    console.error("Data received is not an array:", data);
                }
            } else {
                error = `Errore HTTP: ${res.status}`;
                console.log("Error:", error);
            }
        } catch (networkError) {
            error = `Errore di rete: ${networkError.message}`;
            console.log("Errore di rete:", networkError);
        } finally {
            loading = false;
        }
    }

    async function fetchAllArticoli() {
        loading = true;
        error = null;
        articoli = [];
        
        try {
            const res = await fetch(`https://backendls-1.onrender.com/articoli/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            });
           
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                
                if (Array.isArray(data)) {
                    data.forEach(articolo => {
                        articoli = [...articoli, articolo];
                    });
                    console.log(`Caricati ${articoli.length} articoli per la categoria: ${categoria}`);
                    
                    if (searchedProduct) {
                        highlightedProductId = searchedProduct._id || searchedProduct.Id_art;
                        setTimeout(() => {
                            scrollToHighlightedProduct();
                        }, 100);
                    }
                } else {
                    error = "Formato dati non valido - expected array";
                    console.error("Data received is not an array:", data);
                }
            } else {
                error = `Errore HTTP: ${res.status}`;
                console.log("Error:", error);
            }
        } catch (networkError) {
            error = `Errore di rete: ${networkError.message}`;
            console.log("Errore di rete:", networkError);
        } finally {
            loading = false;
        }
    }
    
    function scrollToHighlightedProduct() {
        if (highlightedProductId) {
            const element = document.getElementById(`product-${highlightedProductId}`);
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center'
                });
                element.classList.add('pulse-effect');
                setTimeout(() => {
                    element.classList.remove('pulse-effect');
                }, 3000);
            }
        }
    }
    
    function isHighlighted(articolo) {
        if (!highlightedProductId) return false;
        return articolo._id === highlightedProductId || articolo.Id_art === highlightedProductId;
    }
    
    onMount(() => {
        if (categoria) {
            if (categoria == "Tutti gli articoli"){
                fetchAllArticoli();
            }else{
            fetchArticoli(categoria);
            }
        }
    });
</script>

<!-- Pulsante Home in alto a destra -->
<button class="home-button" on:click={goToHome} title="Torna alla Home">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
</button>

<div class="main-container">
    <div class="header-container">
        <h1>{categoria}</h1>
        <div class="title-decoration"></div>
        {#if searchedProduct}
            <div class="search-info">
                <span class="search-badge">
                    <span class="search-icon">🔍</span>
                    Prodotto cercato: "{searchedProduct.nome_prodotto}"
                </span>
            </div>
        {/if}
    </div>

    {#if loading}
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Caricamento prodotti...</p>
        </div>
    {/if}

    {#if error}
        <div class="error">
            <div class="error-icon">⚠️</div>
            <p>{error}</p>
        </div>
    {/if}

    {#if articoli.length > 0}
        <div class="products-grid">
            {#each articoli as articolo, index (index)}
                <div 
                    id="product-{articolo._id || articolo.Id_art}"
                    class="product-container"
                    class:highlighted={isHighlighted(articolo)}
                >
                    <Card {articolo} {pagina}/>
                    {#if isHighlighted(articolo)}
                        <div class="highlight-label">
                            <span class="highlight-icon">⭐</span>
                            Prodotto cercato
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    {:else if !loading && !error}
        <div class="no-products">
            <div class="no-products-icon">📦</div>
            <h3>Nessun prodotto trovato</h3>
            <p>Non ci sono prodotti disponibili per: <strong>{categoria}</strong></p>
        </div>
    {/if}
</div>

<style>
    :root {
        --primary-green: #4cff4c;
        --primary-green-dark: #39d939;
        --primary-green-light: rgba(76, 255, 76, 0.2);
        --accent-black: #1a1a1a;
        --accent-dark: #0d0d0d;
        --bg-cream: #1a1a1a;
        --text-dark: #ffffff;
        --border-elegant: rgba(76, 255, 76, 0.3);
        --shadow-elegant: rgba(76, 255, 76, 0.25);
        --gradient-main: linear-gradient(135deg, var(--primary-green) 0%, var(--primary-green-dark) 100%);
    }

    /* Stili per il pulsante Home */
    .home-button {
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1000;
        background: var(--gradient-main);
        color: var(--accent-black);
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px var(--shadow-elegant);
        transition: all 0.3s ease;
        border: 2px solid var(--primary-green);
    }

    .home-button:hover {
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 8px 20px var(--shadow-elegant);
        background: var(--primary-green);
    }

    .home-button:active {
        transform: translateY(0) scale(0.95);
    }

    .home-button svg {
        transition: transform 0.2s ease;
    }

    .home-button:hover svg {
        transform: translateX(-2px);
    }

    .main-container {
        min-height: 100vh;
        background: 
            radial-gradient(circle at 20% 20%, rgba(76, 255, 76, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(76, 255, 76, 0.08) 0%, transparent 50%),
            linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
        padding: 2rem;
        font-family: 'Inter', 'Georgia', 'Times New Roman', serif;
    }
    
    .header-container {
        text-align: center;
        margin-bottom: 3rem;
    }

    h1 {
        font-size: 3rem;
        font-weight: 900;
        color: var(--primary-green);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        margin-bottom: 1rem;
        text-shadow: 
            0 0 20px rgba(76, 255, 76, 0.4),
            0 0 40px rgba(76, 255, 76, 0.2);
        font-family: 'Playfair Display', serif;
    }

    .title-decoration {
        width: 120px;
        height: 4px;
        background: var(--gradient-main);
        margin: 0 auto 2rem;
        border-radius: 2px;
        box-shadow: 0 0 10px rgba(76, 255, 76, 0.5);
    }
    
    .search-info {
        margin-top: 1.5rem;
        display: flex;
        justify-content: center;
    }
    
    .search-badge {
        background: var(--gradient-main);
        color: var(--accent-black);
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 1rem;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 0 8px 24px var(--shadow-elegant);
        border: 3px solid var(--primary-green);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        transition: all 0.3s ease;
    }

    .search-badge:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 32px var(--shadow-elegant);
    }

    .search-icon {
        font-size: 1.2rem;
    }
    
    .loading {
        text-align: center;
        padding: 4rem;
        color: var(--text-dark);
    }

    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid var(--border-elegant);
        border-top: 4px solid var(--primary-green);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1.5rem;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .loading p {
        font-size: 1.2rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
    }
    
    .error {
        background: rgba(220, 38, 38, 0.1);
        border: 3px solid #dc2626;
        color: #fca5a5;
        padding: 2rem;
        border-radius: 20px;
        margin-bottom: 2rem;
        text-align: center;
        backdrop-filter: blur(20px);
        box-shadow: 0 8px 24px rgba(220, 38, 38, 0.2);
    }

    .error-icon {
        font-size: 2rem;
        margin-bottom: 1rem;
    }

    .error p {
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0;
    }
    
    .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
        margin: 2rem 0;
        max-width: 1400px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .product-container {
        position: relative;
        transition: all 0.3s ease;
        animation: fadeInUp 0.6s ease forwards;
    }

    .product-container:nth-child(even) {
        animation-delay: 0.1s;
    }

    .product-container:nth-child(3n) {
        animation-delay: 0.2s;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .product-container.highlighted {
        transform: scale(1.02) translateY(-8px);
        z-index: 10;
    }
    
    .product-container.highlighted :global(.product-card) {
        border: 3px solid var(--primary-green);
        box-shadow: 0 16px 48px var(--shadow-elegant);
        background: rgba(26, 26, 26, 0.95);
        backdrop-filter: blur(20px);
    }
    
    .highlight-label {
        position: absolute;
        top: -12px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--gradient-main);
        color: var(--accent-black);
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 700;
        box-shadow: 0 8px 24px var(--shadow-elegant);
        z-index: 11;
        animation: bounce 0.6s ease-in-out;
        border: 2px solid var(--primary-green);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .highlight-icon {
        font-size: 1rem;
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
        }
        40% {
            transform: translateX(-50%) translateY(-10px);
        }
        60% {
            transform: translateX(-50%) translateY(-5px);
        }
    }
    
    :global(.pulse-effect) {
        animation: pulse 1s ease-in-out 3;
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 var(--shadow-elegant);
        }
        50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 20px rgba(76, 255, 76, 0);
        }
        100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(76, 255, 76, 0);
        }
    }
    
    .no-products {
        text-align: center;
        padding: 4rem;
        background: rgba(26, 26, 26, 0.8);
        backdrop-filter: blur(20px);
        border: 3px solid var(--border-elegant);
        border-radius: 20px;
        color: var(--text-dark);
        max-width: 600px;
        margin: 2rem auto;
        box-shadow: 0 8px 24px var(--shadow-elegant);
    }

    .no-products-icon {
        font-size: 4rem;
        margin-bottom: 1.5rem;
        color: var(--primary-green);
    }

    .no-products h3 {
        font-size: 1.8rem;
        color: var(--primary-green);
        margin-bottom: 1rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }

    .no-products p {
        font-size: 1.1rem;
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.6;
    }

    .no-products strong {
        color: var(--primary-green);
        font-weight: 600;
    }

    @media (max-width: 768px) {
        .main-container {
            padding: 1rem;
        }

        .home-button {
            top: 15px;
            left: 15px;
            width: 45px;
            height: 45px;
        }

        h1 {
            font-size: 2rem;
        }

        .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
        }

        .search-badge {
            font-size: 0.9rem;
            padding: 10px 20px;
        }

        .no-products {
            padding: 2.5rem 1.5rem;
        }

        .no-products h3 {
            font-size: 1.4rem;
        }
    }
</style>