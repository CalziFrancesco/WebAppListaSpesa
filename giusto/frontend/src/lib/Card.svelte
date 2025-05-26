<script>
    import { goto } from "$app/navigation";
    import { invalidateAll } from '$app/navigation';

  export let articolo = {};
  export let pagina = {};
  
  const formatPrice = (price) => {
    return price?.replace('$', '€') || 'N/A';
  };
  
  const getStatusColor = (stato) => {
    switch(stato?.toLowerCase()) {
      case 'disponibile': return 'text-green-600 bg-green-100';
      case 'esaurito': return 'text-red-600 bg-red-100';
      case 'in arrivo': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const generateStars = (rating) => {
    if (!rating) return '';
    const numRating = parseFloat(rating.split('/')[0]);
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 !== 0;
    
    return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(5 - Math.ceil(numRating));
  };

  const getButtonClasses = (pagina) => {
    const baseClasses = "add-to-cart-btn";
    
    switch(pagina?.toLowerCase()) {
      case 'carrello':
        return `${baseClasses} btn-remove`;
      case 'corridoi':
        return `${baseClasses} btn-add`;
      default:
        return `${baseClasses} btn-default`;
    }
  };

  const getButtonText = (pagina, statoArticolo) => {
    if (statoArticolo?.toLowerCase() === 'esaurito') {
      return '🚫 Non Disponibile';
    }
    
    switch(pagina?.toLowerCase()) {
      case 'carrello':
        return '🗑️ Rimuovi dal Carrello';
      case 'corridoi':
        return '🛒 Aggiungi al Carrello';
      default:
        return '📦 Azione Prodotto';
    }
  };

  async function aggiungiAlCarrello() {
    try {
      const res = await fetch(`https://backendls-1.onrender.com/carrello/utente/aggiungi`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(articolo)
      });

      if (res.ok) {
        alert('Prodotto aggiunto al carrello!');
      } else {
        const data = await res.json();
        alert(data.message || 'Errore nell\'aggiungere il prodotto al carrello');
      }
    } catch (err) {
      console.error('Errore:', err);
      alert('Errore di rete nell\'aggiungere il prodotto al carrello');
    }
  }

  async function rimuoviArticolo() {
    try {
      const res = await fetch(`https://backendls-1.onrender.com/rimuoviArticolo/utente/${articolo.Id_art}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });

      if (res.ok) {
        window.location.reload()
      } else {
        const data = await res.json();
        alert(data.message || 'Errore nel rimuovere il prodotto dal carrello');
      }
    } catch (err) {
      console.error('Errore:', err);
      alert('Errore di rete nel rimuovere il prodotto dal carrello');
    }
  } 
  
  function azione() {
    console.log('Pagina:', pagina, 'Azione richiesta per articolo:', articolo.Id_art);
    if (pagina?.toLowerCase() === "carrello") {    
      rimuoviArticolo();
    } else if (pagina?.toLowerCase() === "corridoi") {
      aggiungiAlCarrello();
    } else {
      console.log('Pagina non riconosciuta:', pagina);
    }
  }
</script>

<div class="product-card">
  <div class="card-header">
    <h3 class="product-name">{articolo.nome_prodotto || 'N/A'}</h3>
    <span class="brand">{articolo.marca}</span>
  </div>
  
  <p class="description">{articolo.descrizione_prodotto || 'N/A'}</p>
  
  <div class="price-section">
    <div class="price-container">
      <span class="price">{formatPrice(articolo.prezzo) || 'N/A'}</span>
      <span class="quantity">/ {articolo.quantità || 'unità'}</span>
    </div>
    {#if articolo.sconto && articolo.sconto !== '0%'}
      <span class="discount">-{articolo.sconto}</span>
    {/if}
  </div>
  
  {#if articolo.rating}
    <div class="rating">
      <span class="stars">{generateStars(articolo.rating)}</span>
      <span class="rating-text">{articolo.rating}</span>
    </div>
  {/if}
  
  <div class="status-container">
    <span class="status {getStatusColor(articolo.stato)}">{articolo.stato || 'N/A'}</span>
  </div>
  
  <div class="details">
    <div class="detail-row">
      <span class="label">Categoria:</span>
      <span class="value">{articolo.categoria || 'N/A'}</span>
    </div>
    
    <div class="detail-row">
      <span class="label">Origine:</span>
      <span class="value">{articolo.origine || 'N/A'}</span>
    </div>
    
    <div class="detail-row">
      <span class="label">Posizione:</span>
      <span class="value">Scaffale {articolo.scaffale || 'N/A'} - Corsia {articolo.corsia || 'N/A'}</span>
    </div>
    
    {#if articolo.allergeni && articolo.allergeni !== 'nessuno'}
      <div class="detail-row">
        <span class="label">Allergeni:</span>
        <span class="value allergeni">{articolo.allergeni}</span>
      </div>
    {/if}
  </div>
  
  
  <div class="add-to-cart-container">
    <button 
      class={getButtonClasses(pagina)}
      on:click={azione}
      disabled={articolo.stato?.toLowerCase() === 'esaurito'}>
        {getButtonText(pagina, articolo.stato)}
      </button>
    </div>
  
  {#if articolo.fornitore}
    <div class="footer">
      <small class="supplier">Fornitore: {articolo.fornitore}</small>
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

        body {
            background: var(--bg-cream);
            font-family: 'Inter', 'Georgia', 'Times New Roman', serif;
            color: var(--text-dark);
            padding: 2rem;
            background: 
                radial-gradient(circle at 20% 20%, rgba(76, 255, 76, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(76, 255, 76, 0.08) 0%, transparent 50%),
                linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
            min-height: 100vh;
        }

        .demo-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .product-card {
            background: rgba(26, 26, 26, 0.95);
            backdrop-filter: blur(20px);
            border: 3px solid var(--border-elegant);
            border-radius: 20px;
            padding: 24px;
            box-shadow: 0 8px 32px var(--shadow-elegant);
            max-width: 420px;
            font-family: 'Inter', serif;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .product-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--gradient-main);
            opacity: 0.8;
        }

        .product-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 16px 48px var(--shadow-elegant);
            border-color: var(--primary-green);
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid var(--border-elegant);
        }

        .product-name {
            font-size: 20px;
            font-weight: 700;
            color: var(--text-dark);
            margin: 0;
            flex: 1;
            text-transform: capitalize;
            line-height: 1.3;
        }

        .brand {
            font-size: 12px;
            color: var(--primary-green);
            font-weight: 600;
            margin-left: 16px;
            background: var(--primary-green-light);
            padding: 4px 8px;
            border-radius: 8px;
            border: 1px solid var(--primary-green);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .description {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 20px;
            line-height: 1.5;
            font-style: italic;
        }

        .price-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding: 12px 0;
        }

        .price-container {
            display: flex;
            align-items: baseline;
        }

        .price {
            font-size: 28px;
            font-weight: 800;
            color: var(--primary-green);
            text-shadow: 0 0 10px rgba(76, 255, 76, 0.3);
        }

        .quantity {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.6);
            margin-left: 6px;
            font-style: italic;
        }

        .discount {
            background: linear-gradient(135deg, #ff4757, #ff3742);
            color: white;
            padding: 6px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
        }

        .rating {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            padding: 8px;
            background: rgba(76, 255, 76, 0.1);
            border-radius: 10px;
            border: 1px solid var(--border-elegant);
        }

        .stars {
            color: #ffd700;
            font-size: 18px;
            margin-right: 10px;
            text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
        }

        .rating-text {
            font-size: 14px;
            color: var(--text-dark);
            font-weight: 600;
        }

        .status-container {
            margin-bottom: 20px;
            text-align: center;
        }

        .status {
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            display: inline-block;
            min-width: 120px;
        }

        .text-green-600 { 
            color: var(--accent-black); 
            background: var(--gradient-main);
            box-shadow: 0 4px 12px var(--shadow-elegant);
        }

        .text-red-600 { 
            color: white; 
            background: linear-gradient(135deg, #ff4757, #ff3742);
            box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
        }

        .text-yellow-600 { 
            color: var(--accent-black); 
            background: linear-gradient(135deg, #ffa502, #ff6348);
            box-shadow: 0 4px 12px rgba(255, 165, 2, 0.3);
        }

        .text-gray-600 { 
            color: var(--text-dark); 
            background: linear-gradient(135deg, #57606f, #747d8c);
            box-shadow: 0 4px 12px rgba(87, 96, 111, 0.3);
        }

        .details {
            border-top: 2px solid var(--border-elegant);
            border-bottom: 2px solid var(--border-elegant);
            padding: 20px 0;
            margin-bottom: 20px;
            background: rgba(76, 255, 76, 0.05);
            border-radius: 10px;
            margin: 20px -8px;
            padding: 20px 16px;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding: 4px 0;
        }

        .detail-row:last-child {
            margin-bottom: 0;
        }

        .label {
            font-size: 12px;
            color: var(--primary-green);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            min-width: 80px;
        }

        .value {
            font-size: 14px;
            color: var(--text-dark);
            font-weight: 500;
            text-align: right;
            flex: 1;
            margin-left: 16px;
        }

        .allergeni {
            color: #ff4757;
            font-weight: 700;
            text-shadow: 0 0 8px rgba(255, 71, 87, 0.3);
        }

        .add-to-cart-container {
            margin: 20px 0 16px;
        }

        .add-to-cart-btn {
            width: 100%;
            padding: 16px 20px;
            color: var(--accent-black);
            border: 3px solid var(--primary-green);
            border-radius: 15px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            position: relative;
            overflow: hidden;
        }

        .btn-add {
            background: var(--gradient-main);
            box-shadow: 0 6px 20px var(--shadow-elegant);
        }

        .btn-add:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px var(--shadow-elegant);
            border-color: var(--primary-green-dark);
        }

        .btn-remove {
            background: linear-gradient(135deg, #ff4757, #ff3742);
            border-color: #ff4757;
            color: white;
            box-shadow: 0 6px 20px rgba(255, 71, 87, 0.3);
        }

        .btn-remove:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(255, 71, 87, 0.4);
            border-color: #ff3742;
        }

        .btn-default {
            background: linear-gradient(135deg, #5352ed, #3742fa);
            border-color: #5352ed;
            color: white;
            box-shadow: 0 6px 20px rgba(83, 82, 237, 0.3);
        }

        .btn-default:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(83, 82, 237, 0.4);
            border-color: #3742fa;
        }

        .add-to-cart-btn:active:not(:disabled) {
            transform: translateY(-1px);
        }

        .add-to-cart-btn:disabled {
            background: linear-gradient(135deg, #57606f, #747d8c) !important;
            border-color: #57606f !important;
            cursor: not-allowed;
            color: rgba(255, 255, 255, 0.5) !important;
            box-shadow: none !important;
        }

        .add-to-cart-btn:disabled:hover {
            transform: none !important;
            box-shadow: none !important;
        }

        .footer {
            border-top: 1px solid var(--border-elegant);
            padding-top: 16px;
            text-align: center;
            background: rgba(76, 255, 76, 0.05);
            margin: 16px -24px -24px;
            padding: 16px 24px;
            border-radius: 0 0 17px 17px;
        }

        .supplier {
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
            font-style: italic;
        }

        @keyframes glow {
            0%, 100% { 
                box-shadow: 0 8px 32px var(--shadow-elegant);
            }
            50% { 
                box-shadow: 0 8px 32px rgba(76, 255, 76, 0.4);
            }
        }

        .product-card:hover {
            animation: glow 2s ease-in-out infinite;
        }

        @media (max-width: 768px) {
            .demo-container {
                grid-template-columns: 1fr;
                padding: 1rem;
            }
            
            .product-card {
                max-width: 100%;
            }
        }
    
</style>