<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  
  let articoli = $state([]);
  let categoria = $state('');
  let errore = $state('');
  let nuovoArticolo = $state({
    Id_art: '',
    nome_prodotto: '',
    descrizione_prodotto: '',
    categoria: '',
    marca: '',
    prezzo: '',
    quantità: '',
    stato: 'disponibile',
    sconto: '0%',
    origine: '',
    urlImg: '',
    fornitore: '',
    allergeni: '',
    ingredienti: '',
    rating: '',
    scaffale: '',
    corsia: ''
  });

  async function caricaArticoli() {
    try {
      const res = await fetch('https://backendls-1.onrender.com/articoli',
                {credentials: 'include'});
      const data = await res.json();
      articoli = data;
    } catch (e) {
      errore = 'Errore nel caricamento articoli';
    }
  }

  async function filtraCategoria() {
    try {
      const res = await fetch(`https://backendls-1.onrender.com/articoli/categoria/${categoria}`,
                {credentials: 'include'});
      const data = await res.json();
      articoli = data;
    } catch (e) {
      errore = 'Errore nel filtro per categoria';
    }
  }

  async function aggiungiArticolo() {
    try {
      const res = await fetch('https://backendls-1.onrender.com/articoli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuovoArticolo),
        credentials: 'include'
      });
      if (!res.ok) throw new Error();
      await caricaArticoli();
      nuovoArticolo = {
        Id_art: '',
        nome_prodotto: '',
        descrizione_prodotto: '',
        categoria: '',
        marca: '',
        prezzo: '',
        quantità: '',
        stato: 'disponibile',
        sconto: '0%',
        origine: '',
        urlImg: '',
        fornitore: '',
        allergeni: '',
        ingredienti: '',
        rating: '',
        scaffale: '',
        corsia: ''
      };
    } catch (e) {
      errore = 'Errore nell\'aggiunta articolo';
    }
  }

  async function eliminaArticolo(id) {
    try {
      const risposta = await fetch(`https://backendls-1.onrender.com/articoli/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (risposta.ok) {
        const dati = await risposta.json();
        console.log('✅ Articolo eliminato:', dati.message);
        await caricaArticoli();
        errore = '';
      } else {
        const erroreResp = await risposta.json();
        console.error('❌ Errore:', erroreResp.message);
        errore = 'Errore nell\'eliminazione dell\'articolo';
      }
    } catch (err) {
      console.error('Errore di rete o del server:', err);
      errore = 'Errore di rete nell\'eliminazione';
    }
  }

  onMount(caricaArticoli);

  function goToHome() {
    goto('/home');
  }
</script>

<h1 class="text-xl font-bold mb-4">Pannello Admin - Articoli</h1>

{#if errore}
  <p class="text-red-600">{errore}</p>
{/if}



<div class="mb-4">
  <input type="text" bind:value={categoria} placeholder="Filtra per categoria" class="border p-1" />
  <button onclick={filtraCategoria} class="bg-blue-500 text-white px-2 py-1 ml-2">Filtra</button>
</div>

<table class="table-auto w-full text-left border">
  <thead>
    <tr>
      <th>ID</th>
      <th>Nome</th>
      <th>Categoria</th>
      <th>Marca</th>
      <th>Prezzo</th>
      <th>Quantità</th>
      <th>Stato</th>
      <th>Corsia</th>
      <th>Scaffale</th>
      <th>Azioni</th>
    </tr>
  </thead>
  <tbody>
    {#each articoli as articolo}
      <tr>
        <td>{articolo.Id_art}</td>
        <td>{articolo.nome_prodotto}</td>
        <td>{articolo.categoria}</td>
        <td>{articolo.marca}</td>
        <td>{articolo.prezzo}</td>
        <td>{articolo.quantità}</td>
        <td>{articolo.stato}</td>
        <td>{articolo.corsia}</td>
        <td>{articolo.scaffale}</td>
        <td>
          <button 
            onclick={() => eliminaArticolo(articolo.Id_art)} 
            class="bg-red-500 text-white px-2 py-1 text-sm hover:bg-red-600"
          >
            Rimuovi
          </button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<h2 class="mt-6 text-lg font-semibold">Aggiungi nuovo articolo</h2>
<div class="space-y-2">
  <input type="number"  bind:value={nuovoArticolo.Id_art} placeholder="ID Articolo" class="border p-1 w-full" />
  <input type="text" bind:value={nuovoArticolo.nome_prodotto} placeholder="Nome prodotto" class="border p-1 w-full" />
  <textarea bind:value={nuovoArticolo.descrizione_prodotto} placeholder="Descrizione prodotto" class="border p-1 w-full h-20"></textarea>
  <input type="text" bind:value={nuovoArticolo.categoria} placeholder="Categoria" class="border p-1 w-full" />
  <input type="text" bind:value={nuovoArticolo.marca} placeholder="Marca" class="border p-1 w-full" />
  <input type="text" bind:value={nuovoArticolo.prezzo} placeholder="Prezzo (es. 12.50$)" class="border p-1 w-full" />
  <input type="text" bind:value={nuovoArticolo.quantità} placeholder="Quantità (es. 500g)" class="border p-1 w-full" />
  <select bind:value={nuovoArticolo.stato} class="border p-1 w-full">
    <option value="disponibile">Disponibile</option>
    <option value="esaurito">Esaurito</option>
  </select>
  <input type="text" bind:value={nuovoArticolo.sconto} placeholder="Sconto (es. 10%)" class="border p-1 w-full" />
  <input type="text" bind:value={nuovoArticolo.origine} placeholder="Origine" class="border p-1 w-full" />
  <input type="url" bind:value={nuovoArticolo.urlImg} placeholder="URL Immagine" class="border p-1 w-full" />
  <input type="text" bind:value={nuovoArticolo.fornitore} placeholder="Fornitore" class="border p-1 w-full" />
  <input type="text" bind:value={nuovoArticolo.allergeni} placeholder="Allergeni" class="border p-1 w-full" />
  <textarea bind:value={nuovoArticolo.ingredienti} placeholder="Ingredienti" class="border p-1 w-full h-16"></textarea>
  <input type="text" bind:value={nuovoArticolo.rating} placeholder="Rating (es. 4/5)" class="border p-1 w-full" />
  <input type="text" bind:value={nuovoArticolo.scaffale} placeholder="Scaffale" class="border p-1 w-full" />
  <input type="text" bind:value={nuovoArticolo.corsia} placeholder="Corsia" class="border p-1 w-full" />
  <button onclick={aggiungiArticolo} class="bg-green-500 text-white px-4 py-1">Aggiungi</button>
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
    --error-red: #dc2626;
    --error-red-light: rgba(220, 38, 38, 0.2);
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
    min-height: 100vh;
    background: 
        radial-gradient(circle at 20% 20%, rgba(76, 255, 76, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(76, 255, 76, 0.08) 0%, transparent 50%),
        linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
    padding: 2rem;
}

h1 {
    font-family: 'Playfair Display', serif;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--primary-green);
    text-shadow: 
        0 0 20px rgba(76, 255, 76, 0.4),
        0 0 40px rgba(76, 255, 76, 0.2);
    font-size: 3rem;
    font-weight: 900;
    margin-bottom: 2rem;
    text-align: center;
}

h2 {
    font-family: 'Playfair Display', serif;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--primary-green);
    text-shadow: 0 0 20px rgba(76, 255, 76, 0.3);
    font-size: 2rem;
    font-weight: 700;
    margin: 2rem 0 1.5rem 0;
}

.text-red-600 {
    color: var(--error-red);
    font-weight: 600;
    margin: 1rem 0;
    padding: 1rem;
    background: var(--error-red-light);
    border: 2px solid var(--error-red);
    border-radius: 12px;
    text-align: center;
    font-size: 1.1rem;
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.mb-4 {
    margin-bottom: 2rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
}

input[type="text"],
textarea,
select,
input[type="number"],
input[type="url"] {
    padding: 0.8rem 1.2rem;
    background: rgba(26, 26, 26, 0.9);
    backdrop-filter: blur(20px);
    border: 3px solid var(--primary-green);
    border-radius: 15px;
    font-family: 'Inter', serif;
    font-size: 1rem;
    color: var(--text-dark);
    box-shadow: 0 4px 12px var(--shadow-elegant);
    transition: all 0.3s ease;
    width: 100%;
}

input[type="text"]::placeholder,
textarea::placeholder,
input[type="number"]::placeholder,
input[type="url"]::placeholder {
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
}

input[type="text"]:focus,
textarea:focus,
select:focus,
input[type="number"]:focus,
input[type="url"]:focus {
    outline: none;
    border-color: var(--primary-green-dark);
    box-shadow: 0 8px 24px var(--shadow-elegant);
    transform: translateY(-2px);
}

.mb-4 input[type="text"] {
    width: 300px;
    max-width: 100%;
}

button {
    background: var(--gradient-main);
    color: var(--accent-black);
    border: 3px solid var(--primary-green);
    border-radius: 25px;
    padding: 12px 24px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px var(--shadow-elegant);
    font-size: 1rem;
    font-family: 'Inter', serif;
}

button:hover {
    background: var(--primary-green-dark);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px var(--shadow-elegant);
}

button.bg-red-500 {
    background: linear-gradient(135deg, var(--error-red) 0%, #b91c1c 100%);
    color: white;
    border-color: var(--error-red);
    padding: 8px 16px;
    font-size: 0.9rem;
}

button.bg-red-500:hover {
    background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
    border-color: #b91c1c;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin: 2rem 0;
    background: rgba(26, 26, 26, 0.95);
    backdrop-filter: blur(20px);
    color: var(--text-dark);
    border: 3px solid var(--primary-green);
    border-radius: 20px;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
    overflow: hidden;
}

thead {
    background: var(--gradient-main);
    color: var(--accent-black);
}

th {
    padding: 1.5rem 1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 1rem;
    border-bottom: 3px solid var(--primary-green);
}

td {
    padding: 1.2rem 1rem;
    border-bottom: 1px solid var(--border-elegant);
    font-size: 0.95rem;
}

tbody tr {
    transition: all 0.3s ease;
    position: relative;
}

tbody tr::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 4px;
    height: 100%;
    background: var(--gradient-main);
    transform: scaleY(0);
    transition: transform 0.3s ease;
}

tbody tr:hover {
    background: rgba(76, 255, 76, 0.08);
    transform: translateX(4px);
}

tbody tr:hover::before {
    transform: scaleY(1);
}

.space-y-2 {
    display: grid;
    gap: 1rem;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background: rgba(26, 26, 26, 0.8);
    backdrop-filter: blur(20px);
    border: 3px solid var(--primary-green);
    border-radius: 20px;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
}

.space-y-2 > * + * {
    margin-top: 0;
}

.space-y-2 button {
    justify-self: center;
    width: fit-content;
    padding: 15px 30px;
    font-size: 1.1rem;
    margin-top: 1rem;
}

textarea {
    resize: vertical;
    min-height: 80px;
}

select {
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%234cff4c' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 12px center;
    background-repeat: no-repeat;
    background-size: 16px;
    padding-right: 40px;
}

.mt-6 {
    margin-top: 3rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    body {
        padding: 1rem;
    }
    
    h1 {
        font-size: 2rem;
    }
    
    h2 {
        font-size: 1.5rem;
    }
    
    .mb-4 {
        flex-direction: column;
        align-items: stretch;
    }
    
    .mb-4 input[type="text"] {
        width: 100%;
    }
    
    table {
        font-size: 0.8rem;
    }
    
    th, td {
        padding: 0.8rem 0.5rem;
    }
    
    .space-y-2 {
        padding: 1rem;
        margin: 1rem 0;
    }
}

@media (max-width: 480px) {
    table {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
    }
    
    th, td {
        padding: 0.6rem 0.4rem;
        font-size: 0.75rem;
    }
}

/* Animations */
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

table, .space-y-2, h1, h2 {
    animation: fadeInUp 0.6s ease forwards;
}

table {
    animation-delay: 0.1s;
}

.space-y-2 {
    animation-delay: 0.2s;
}



</style>