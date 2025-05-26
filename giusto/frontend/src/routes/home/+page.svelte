<script>
    import logo from '$lib/immagini/LOGO.png'
    import lista from '$lib/immagini/liste.png'
    import lente from '$lib/immagini/lenteRicerca.png'
    import {goto} from '$app/navigation'
    import { datiCondivisi } from '$lib/stores.js';
    import Card from '$lib/Card.svelte';

    let searchTerm = '';
    let searchResults = [];
    let isSearching = false;
    let showResults = false;

    async function logout() {
        try {
            const res = await fetch('https://backendls-1.onrender.com/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (res.ok) {
                alert('Logout effettuato');
                goto('/');
            } else {
                const data = await res.json();
                alert(data.message || 'Errore durante il logout');
            }
        } catch (err) {
            alert('Errore di rete durante il logout');
        }
    }

    function navigaCarrello(){
        goto('/carrello')
    }
    
    async function navigaCorridoio(categoria) {
        datiCondivisi.set({cat:categoria})
        goto(`/corridoi`);      
    }

    async function cercaProdotti() {
        if (!searchTerm.trim()) {
            showResults = false;
            return;
        }

        isSearching = true;
        try {
            const res = await fetch(`https://backendls-1.onrender.com/articoli/ricerca/${encodeURIComponent(searchTerm.trim())}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                searchResults = data;
                showResults = true;
            } else {
                console.error('Errore nella ricerca');
                searchResults = [];
                showResults = true;
            }
        } catch (err) {
            console.error('Errore di rete nella ricerca:', err);
            searchResults = [];
            showResults = true;
        } finally {
            isSearching = false;
        }
    }

    function handleSearchKeydown(event) {
        if (event.key === 'Enter') {
            cercaProdotti();
        }
    }

    async function vaiAlProdotto(articolo) {
        const categoria = articolo.categoria;
        datiCondivisi.set({cat: categoria, searchedProduct: articolo});
        showResults = false;
        searchTerm = '';
        goto(`/corridoi`);
    }

    function chiudiRicerca() {
        showResults = false;
        searchTerm = '';
    }

    function evidenziaTesto(testo, termine) {
        if (!testo || !termine) return testo;
        const regex = new RegExp(`(${termine})`, 'gi');
        return testo.replace(regex, '<mark>$1</mark>');
    }
</script>

<div class="main-container">
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div class="header-section">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <img src={lista} alt="" class="lista" onclick={navigaCarrello}>
        
        <div class="logo-title-container">
            <div class="logo">
                <img src={logo} alt="Listify Logo"/>
            </div>
            <div class="titolo">
                <h1>LISTIFY</h1>
                <div class="subtitle">Your Premium Shopping Assistant</div>
            </div>
        </div>

        <button class="logout" onclick={logout}>
            <span class="logout-icon">⚡</span>
            Logout
        </button>
    </div>

    <div class="search-section">
        <div class="search-container">
            <div class="BarraRicerca">
                <input 
                    type="text" 
                    placeholder="Cerca prodotti di qualità..." 
                    bind:value={searchTerm}
                    onkeydown={handleSearchKeydown}
                    oninput={cercaProdotti}
                />
                <button class="search-button" onclick={cercaProdotti} disabled={isSearching}>
                    <img src={lente} alt="Cerca" class="lente">
                </button>
            </div>

            {#if showResults}
                <div class="search-results">
                    <div class="search-results-header">
                        <h3>Risultati di ricerca per "{searchTerm}"</h3>
                        <button class="close-search" onclick={chiudiRicerca}>✕</button>
                    </div>
                    
                    {#if isSearching}
                        <div class="loading">
                            <div class="loading-spinner"></div>
                            <p>Ricerca in corso...</p>
                        </div>
                    {:else if searchResults.length === 0}
                        <div class="no-results">
                            <div class="no-results-icon">🎩</div>
                            <p>Nessun prodotto trovato per "{searchTerm}"</p>
                            <p>Prova con un termine diverso</p>
                        </div>
                    {:else}
                        <div class="results-grid">
                            {#each searchResults as articolo}
                                <!-- svelte-ignore a11y_click_events_have_key_events -->
                                <!-- svelte-ignore a11y_no_static_element_interactions -->
                                <div class="search-result-item" onclick={() => vaiAlProdotto(articolo)}>
                                    <div class="result-info">
                                        <h4>{@html evidenziaTesto(articolo.nome_prodotto, searchTerm)}</h4>
                                        <p class="result-category">📍 Corridoio: {articolo.categoria}</p>
                                        <p class="result-description">{@html evidenziaTesto(articolo.descrizione_prodotto, searchTerm)}</p>
                                        <div class="result-details">
                                            <span class="result-price">{articolo.prezzo}</span>
                                            {#if articolo.marca}
                                                <span class="result-brand">{@html evidenziaTesto(articolo.marca, searchTerm)}</span>
                                            {/if}
                                        </div>
                                    </div>
                                    <div class="result-action">
                                        <span class="go-arrow">→</span>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    </div>

    <div class="corridoi-container" class:blurred={showResults}>
        <div class="section-title">
            <h2>Esplora i Nostri Corridoi</h2>
            <div class="title-decoration"></div>
        </div>

        <!-- Pulsante Tutti i Prodotti Centrato -->
        <div class="main-button-section">
            <button class="corridoio premium main-button" onclick={() => navigaCorridoio('Tutti gli articoli')}>
                <div class="corridoio-background"></div>
                <div class="corridoio-content">
                    <div class="corridoio-icona">🛒</div>
                    <div class="corridoio-nome">Tutti i prodotti</div>
                </div>
            </button>
        </div>

        <div class="corridoi-grid">
            <button class="corridoio" onclick={() => navigaCorridoio('frutta e verdura')}>
                <div class="corridoio-background"></div>
                <div class="corridoio-content">
                    <div class="corridoio-icona">🍎</div>
                    <div class="corridoio-nome">Frutta e Verdura</div>
                </div>
            </button>

            <button class="corridoio" onclick={() => navigaCorridoio('carne e pesce')}>
                <div class="corridoio-background"></div>
                <div class="corridoio-content">
                    <div class="corridoio-icona">🥩</div>
                    <div class="corridoio-nome">Carne e Pesce</div>
                </div>
            </button>

            <button class="corridoio" onclick={() => navigaCorridoio('pane e formaggio')}>
                <div class="corridoio-background"></div>
                <div class="corridoio-content">
                    <div class="corridoio-icona">🥖</div>
                    <div class="corridoio-nome">Pane e Formaggio</div>
                </div>
            </button>

            <button class="corridoio" onclick={() => navigaCorridoio('sughi e pasta')}>
                <div class="corridoio-background"></div>
                <div class="corridoio-content">
                    <div class="corridoio-icona">🍝</div>
                    <div class="corridoio-nome">Sughi e Pasta</div>
                </div>
            </button>

            <button class="corridoio" onclick={() => navigaCorridoio('surgelati')}>
                <div class="corridoio-background"></div>
                <div class="corridoio-content">
                    <div class="corridoio-icona">🍦</div>
                    <div class="corridoio-nome">Surgelati</div>
                </div>
            </button>

            <button class="corridoio" onclick={() => navigaCorridoio('bevande')}>
                <div class="corridoio-background"></div>
                <div class="corridoio-content">
                    <div class="corridoio-icona">🍾</div>
                    <div class="corridoio-nome">Bevande</div>
                </div>
            </button>

            <button class="corridoio" onclick={() => navigaCorridoio("dolci")}>
                <div class="corridoio-background"></div>
                <div class="corridoio-content">
                    <div class="corridoio-icona">🍰</div>
                    <div class="corridoio-nome">Dolci</div>
                </div>
            </button>

            <button class="corridoio" onclick={() => navigaCorridoio('prodotti per la casa')}>
                <div class="corridoio-background"></div>
                <div class="corridoio-content">
                    <div class="corridoio-icona">🏠</div>
                    <div class="corridoio-nome">Prodotti per la casa</div>
                </div>
            </button>

            <button class="corridoio" onclick={() => navigaCorridoio('prodotti per animali')}>
                <div class="corridoio-background"></div>
                <div class="corridoio-content">
                    <div class="corridoio-icona">🐈</div>
                    <div class="corridoio-nome">Prodotti per animali</div>
                </div>
            </button>
        </div>
    </div>
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

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: var(--bg-cream);
    font-family: 'Inter', 'Georgia', 'Times New Roman', serif;
    color: var(--text-dark);
    line-height: 1.6;
}

.main-container {
    min-height: 100vh;
    background: 
        radial-gradient(circle at 20% 20%, rgba(76, 255, 76, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(76, 255, 76, 0.08) 0%, transparent 50%),
        linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    position: relative;
}

.logo-title-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    justify-content: center;
    margin-left: 100px;
}

.logo {
    margin-bottom: 1rem;
    filter: drop-shadow(0 8px 16px var(--shadow-elegant));
}

.logo img {
    width: 410px;
    height: 280px;
    transition: transform 0.3s ease;
}

.logo:hover img {
    transform: scale(1.05) rotate(2deg);
}

.titolo {
    text-align: center;
}

.titolo h1 {
    font-size: 3rem;
    font-weight: 900;
    color: var(--primary-green);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    margin-bottom: 0.5rem;
    text-shadow: 
        0 0 20px rgba(76, 255, 76, 0.4),
        0 0 40px rgba(76, 255, 76, 0.2);
    font-family: 'Playfair Display', serif;
}

.subtitle {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.7);
    font-style: italic;
    opacity: 0.8;
    font-family: 'Inter', serif;
}

.lista {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px var(--shadow-elegant);
    border: 3px solid var(--primary-green);
    object-fit: cover;
    background: rgba(26, 26, 26, 0.8);
}

.lista:hover {
    transform: translateY(-3px) rotate(5deg);
    box-shadow: 0 8px 20px var(--shadow-elegant);
    border-color: var(--primary-green-dark);
}

.logout {
    background: var(--gradient-main);
    color: var(--accent-black);
    border: 3px solid var(--primary-green);
    border-radius: 25px;
    padding: 12px 24px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px var(--shadow-elegant);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.logout:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px var(--shadow-elegant);
    background: var(--primary-green-dark);
}

.logout-icon {
    font-size: 1.2rem;
}

.search-section {
    padding: 0 2rem 2rem;
}

.search-container {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}

.BarraRicerca {
    display: flex;
    align-items: center;
    border: 3px solid var(--primary-green);
    border-radius: 25px;
    height: 60px;
    width: 70%;
    max-width: 600px;
    padding: 0 1.5rem;
    background: rgba(26, 26, 26, 0.9);
    backdrop-filter: blur(20px);
    box-shadow: 0 8px 24px var(--shadow-elegant);
    position: relative;
    overflow: hidden;
}

.BarraRicerca::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--gradient-main);
}

.BarraRicerca input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 18px;
    padding: 0.5rem;
    background: transparent;
    color: var(--text-dark);
    font-family: 'Inter', serif;
}

.BarraRicerca input::placeholder {
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
}

.search-button {
    background: var(--gradient-main);
    border: none;
    cursor: pointer;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
}

.search-button:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px var(--shadow-elegant);
}

.search-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.lente {
    width: 24px;
    height: auto;
}

.search-results {
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    width: 85%;
    max-width: 900px;
    background: rgba(26, 26, 26, 0.95);
    backdrop-filter: blur(20px);
    border: 3px solid var(--primary-green);
    border-radius: 20px;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
    z-index: 1000;
    max-height: 70vh;
    overflow-y: auto;
}

.search-results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 2px solid var(--border-elegant);
    background: var(--gradient-main);
    border-radius: 17px 17px 0 0;
}

.search-results-header h3 {
    margin: 0;
    color: var(--accent-black);
    font-size: 1.3rem;
    font-weight: 600;
}

.close-search {
    background: var(--accent-black);
    color: var(--primary-green);
    border: 2px solid var(--primary-green);
    border-radius: 50%;
    width: 35px;
    height: 35px;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.close-search:hover {
    background: #dc2626;
    color: white;
    border-color: #dc2626;
    transform: scale(1.1);
}

.loading {
    padding: 3rem;
    text-align: center;
    color: var(--text-dark);
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-elegant);
    border-top: 4px solid var(--primary-green);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.no-results {
    padding: 3rem;
    text-align: center;
    color: var(--text-dark);
}

.no-results-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: var(--primary-green);
}

.results-grid {
    padding: 1.5rem;
}

.search-result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border: 2px solid var(--border-elegant);
    border-radius: 15px;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(26, 26, 26, 0.8);
    position: relative;
    overflow: hidden;
}

.search-result-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--gradient-main);
    transform: scaleY(0);
    transition: transform 0.3s ease;
}

.search-result-item:hover {
    background: rgba(26, 26, 26, 0.95);
    border-color: var(--primary-green);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px var(--shadow-elegant);
}

.search-result-item:hover::before {
    transform: scaleY(1);
}

.result-info {
    flex: 1;
}

.result-info h4 {
    margin: 0 0 0.5rem 0;
    color: var(--text-dark);
    font-size: 1.2rem;
    font-weight: 600;
}

.result-category {
    color: var(--primary-green);
    font-weight: 600;
    margin: 0.25rem 0;
    font-size: 1rem;
}

.result-description {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.95rem;
    margin: 0.5rem 0;
    line-height: 1.5;
}

.result-details {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-top: 0.5rem;
}

.result-price {
    font-weight: 700;
    color: var(--primary-green);
    font-size: 1.2rem;
}

.result-brand {
    color: var(--accent-black);
    font-size: 0.9rem;
    background: var(--primary-green-light);
    padding: 0.3rem 0.6rem;
    border-radius: 8px;
    border: 1px solid var(--primary-green);
}

.result-action {
    margin-left: 1rem;
}

.go-arrow {
    font-size: 1.8rem;
    color: var(--primary-green);
    font-weight: bold;
    transition: transform 0.2s ease;
}

.search-result-item:hover .go-arrow {
    transform: translateX(5px);
}

:global(mark) {
    background: var(--primary-green-light);
    color: var(--text-dark);
    padding: 0.2rem 0.4rem;
    border-radius: 6px;
    font-weight: 600;
    border: 1px solid var(--primary-green);
}

.main-button-section {
    display: flex;
    justify-content: center;
    margin-bottom: 3rem;
}

.main-button {
    width: 300px;
    margin: 0 auto;
}

.corridoi-container {
    padding: 2rem;
    transition: all 0.3s ease;
}

.corridoi-container.blurred {
    filter: blur(3px);
    opacity: 0.6;
    pointer-events: none;
}

.section-title {
    text-align: center;
    margin-bottom: 3rem;
}

.section-title h2 {
    font-size: 2.5rem;
    color: var(--primary-green);
    font-weight: 700;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-shadow: 0 0 20px rgba(76, 255, 76, 0.3);
    font-family: 'Playfair Display', serif;
}

.title-decoration {
    width: 100px;
    height: 4px;
    background: var(--gradient-main);
    margin: 0 auto;
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(76, 255, 76, 0.5);
}

.corridoi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.corridoio {
    background: rgba(26, 26, 26, 0.8);
    backdrop-filter: blur(20px);
    border: 3px solid var(--primary-green);
    border-radius: 20px;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 24px var(--shadow-elegant);
    transition: all 0.3s ease;
    cursor: pointer;
    height: 140px;
    position: relative;
    overflow: hidden;
    font-family: 'Inter', serif;
}

.corridoio-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--gradient-main);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.corridoio-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-dark);
    transition: color 0.3s ease;
}

.corridoio:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 16px 48px var(--shadow-elegant);
    border-color: var(--primary-green-dark);
}

.corridoio:hover .corridoio-background {
    opacity: 0.95;
}

.corridoio:hover .corridoio-content {
    color: var(--accent-black);
}

.corridoio-icona {
    font-size: 3rem;
    margin-bottom: 0.8rem;
    transition: transform 0.3s ease;
    color: var(--primary-green);
}

.corridoio:hover .corridoio-icona {
    transform: scale(1.2) rotate(5deg);
    color: var(--accent-black);
}

.corridoio-nome {
    font-weight: 600;
    text-align: center;
    font-size: 1.1rem;
    line-height: 1.3;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

@media (max-width: 768px) {
    .header-section {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    }

    .logo-title-container {
        order: 2;
    }

    .lista {
        order: 1;
    }

    .logout {
        order: 3;
    }

    .titolo h1 {
        font-size: 2rem;
    }

    .BarraRicerca {
        width: 90%;
    }

    .main-button {
        width: 280px;
    }

    .corridoi-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
    }

    .search-results {
        width: 95%;
    }

    .section-title h2 {
        font-size: 2rem;
    }
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

.corridoio {
    animation: fadeInUp 0.6s ease forwards;
}

.corridoio:nth-child(even) {
    animation-delay: 0.1s;
}

.corridoio:nth-child(3n) {
    animation-delay: 0.2s;
}
</style>