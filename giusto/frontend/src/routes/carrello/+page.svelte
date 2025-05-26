<script>
  import { onMount } from 'svelte';
  import Card from '$lib/Card.svelte';
  import { goto } from '$app/navigation';

  let articoli = [];
  let error = '';
  let pagina = "carrello"
  
  onMount(async () => {
    try {
      const res = await fetch('https://backendls-1.onrender.com/carrello/utente', {
        credentials: 'include'
      });
      if (!res.ok) {
        const data = await res.json();
        error = data.message;
        return;
      }
      const data = await res.json();
      articoli = data.articoli;
      console.log(articoli);
      articoli = articoli.sort((a, b) => {
        const corsiaA = parseInt(a.corsia);
        const corsiaB = parseInt(b.corsia);
        if (corsiaA !== corsiaB) {
          return corsiaA - corsiaB;
        }
        return a.scaffale.localeCompare(b.scaffale);
      });
    } catch (err) {
      error = 'Errore di rete nel recupero del carrello';
    }
  });

  
  async function svuotaCarrello() {
     try {
      const res = await fetch(`https://backendls-1.onrender.com/carrello/utente/svuota`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });

      if (res.ok) {
        articoli = [];
        alert('Carrello svuotato con successo!');
      } else {
        const data = await res.json();
        alert(data.message || 'Errore nel svuotare il carrello');
      }
    } catch (err) {
      console.error('Errore:', err);
      alert('Errore di rete nel svuotare il carrello');
    }
  } 

  function calcolaTotale() {
    return articoli.reduce((totale, articolo) => {
      const prezzo = parseFloat(articolo.prezzo?.replace('€', '').replace('$', '') || 0);
      return totale + prezzo;
    }, 0).toFixed(2);
  }

  function goToHome() {
    goto('/home');
  }

</script>

<button class="home-button" on:click={goToHome} title="Torna alla Home">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
</button>

<div class="carrello-container">
  {#if error}
    <div class="error-card">
      <div class="error-icon">⚠️</div>
      <div class="error-message">{error}</div>
    </div>
  {:else}
    <div class="carrello-header">
      <h1 class="carrello-title">Il Tuo Carrello</h1>
      {#if articoli.length > 0}
        <div class="items-count">{articoli.length} articol{articoli.length === 1 ? 'o' : 'i'}</div>
      {/if}
    </div>

    {#if articoli.length === 0}
      <div class="empty-cart">
        <div class="empty-icon">🛒</div>
        <h2>Il tuo carrello è vuoto</h2>
        <p>Aggiungi alcuni articoli per iniziare la spesa</p>
        <button class="continue-shopping" on:click={goto('/home')}>
          Continua a fare shopping
        </button>
      </div>
    {:else}
      <div class="articoli-grid">
        {#each articoli as articolo}
          <Card {articolo} {pagina}/>
        {/each}
      </div>
      
      <div class="totale-section">
        <div class="totale-card">
          <div class="totale-header">
            <span class="totale-label">Totale Spesa</span>
            <span class="totale-amount">€{calcolaTotale()}</span>
          </div>
          <div class="totale-info">
            <small>IVA inclusa • {articoli.length} articol{articoli.length === 1 ? 'o' : 'i'}</small>
          </div>
        </div>
      </div>
      
      <div class="carrello-actions">
        <button class="svuota-btn" on:click={svuotaCarrello}>
          <span class="btn-icon">🗑️</span>
          Svuota Carrello
        </button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .carrello-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .carrello-header {
    text-align: center;
    margin-bottom: 30px;
    padding: 20px 0;
    border-bottom: 3px solid #4ade80;
    position: relative;
  }

  .carrello-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #e5e7eb;
    margin: 0 0 10px 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    letter-spacing: -0.5px;
  }

  .items-count {
    background: linear-gradient(135deg, #4ade80, #22c55e);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    display: inline-block;
    box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3);
  }

  .empty-cart {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 2px solid #e5e7eb;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 20px;
    opacity: 0.7;
  }

  .empty-cart h2 {
    color: #374151;
    margin-bottom: 10px;
    font-weight: 700;
  }

  .empty-cart p {
    color: #6b7280;
    font-size: 1.1rem;
    margin-bottom: 30px;
  }

  .continue-shopping {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
  }

  .continue-shopping:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
  }

  .articoli-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 30px;
  }

  @media (max-width: 1024px) {
    .articoli-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 600px) {
    .articoli-grid {
      grid-template-columns: 1fr;
    }
  }

  .totale-section {
    margin-bottom: 30px;
  }

  .totale-card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
    border: 2px solid #4ade80;
    position: relative;
    overflow: hidden;
  }

  .totale-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #4ade80, #22c55e, #16a34a);
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .totale-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .totale-label {
    font-size: 1.2rem;
    font-weight: 600;
    color: #e5e7eb;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .totale-amount {
    font-size: 2rem;
    font-weight: 800;
    color: #4ade80;
    text-shadow: 0 0 20px rgba(74, 222, 128, 0.5);
  }

  .totale-info {
    color: #9ca3af;
    font-size: 0.9rem;
  }

  .carrello-actions {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 40px;
  }

  .checkout-btn, .svuota-btn {
    width: 100%;
    padding: 16px 24px;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    overflow: hidden;
  }

  .checkout-btn {
    background: linear-gradient(135deg, #4ade80, #22c55e);
    color: white;
    box-shadow: 0 8px 24px rgba(74, 222, 128, 0.4);
  }

  .checkout-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(74, 222, 128, 0.6);
    background: linear-gradient(135deg, #22c55e, #16a34a);
  }

  .svuota-btn {
    background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
    color: #e5e7eb;
    border: 2px solid #374151;
  }

  .svuota-btn:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    border-color: #dc2626;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(220, 38, 38, 0.4);
  }

  .btn-icon {
    font-size: 1.2rem;
  }

  .error-card {
    background: linear-gradient(135deg, #fee2e2, #fecaca);
    border: 2px solid #ef4444;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
    box-shadow: 0 8px 24px rgba(239, 68, 68, 0.2);
  }

  .error-icon {
    font-size: 2rem;
  }

  .error-message {
    color: #dc2626;
    font-weight: 600;
    font-size: 1.1rem;
  }

  @media (min-width: 640px) {
    .carrello-actions {
      flex-direction: row;
    }

    .checkout-btn {
      flex: 2;
    }

    .svuota-btn {
      flex: 1;
    }
  }

  .home-button {
    position: fixed;
    top: 20px;
    left: 20px;  /* POSIZIONE CORRETTA */
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

</style>