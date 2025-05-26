<script>
  let nome = $state('');
  let cognome = $state('');
  let username = $state('');
  let email = $state('');
  let password = $state('');
  let isLoading = $state(false);
  let error = $state('');
  let success = $state('');
  import { goto } from '$app/navigation';

  async function handleRegistration(event) {
    event.preventDefault();
    
    error = '';
    success = '';
    
    if (!nome || !cognome || !username || !email || !password) {
      error = 'Tutti i campi sono obbligatori';
      return;
    }
    
    isLoading = true;
    
    try {
      const res = await fetch('https://backendls-1.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          nome, 
          cognome, 
          username, 
          email, 
          password 
        }),
        credentials: 'include'
      });
      
      if (!res.ok) {
        const data = await res.json();
        error = data.message || 'Errore durante la registrazione';
        return;
      }
      
      success = 'Registrazione completata con successo!';
      
      setTimeout(() => {
        goto('/');
      }, 2000);
      
    } catch (err) {
      error = 'Errore di rete durante la registrazione';
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Registrazione - LISTIFY</title>
</svelte:head>

<main class="login-container">
  <div class="login-card">
    <div class="logo-section">
      <h1>LISTIFY</h1>
      <div class="subtitle">Eleganza digitale</div>
    </div>
   
    <form onsubmit={handleRegistration}>
      <div class="field">
        <label for="nome">Nome</label>
        <input
          id="nome"
          type="text"
          bind:value={nome}
          placeholder="Il tuo nome"
          required
        />
      </div>
      
      <div class="field">
        <label for="cognome">Cognome</label>
        <input
          id="cognome"
          type="text"
          bind:value={cognome}
          placeholder="Il tuo cognome"
          required
        />
      </div>
      
      <div class="field">
        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          bind:value={username}
          placeholder="La tua username"
          required
        />
      </div>
      
      <div class="field">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          placeholder="La tua email"
          required
        />
      </div>
      
      <div class="field">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="La tua password"
          required
        />
      </div>
      
      {#if error}
        <div class="error">{error}</div>
      {/if}
      
      {#if success}
        <div class="success">{success}</div>
      {/if}
      
      <button type="submit" disabled={isLoading} class="register-btn">
        {isLoading ? 'Registrazione in corso...' : 'Registrati'}
      </button>
    </form>
    
    <p class="login-link">
      <a href="/">Hai già un account? Accedi</a>
    </p>
  </div>
  
  <div class="background-pattern"></div>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500&display=swap');
  
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    position: relative;
    overflow: hidden;
  }
  
  .background-pattern {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 20%, rgba(76, 255, 76, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(76, 255, 76, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 60%, rgba(76, 255, 76, 0.05) 0%, transparent 50%);
    z-index: 0;
  }
  
  .login-card {
    background: rgba(26, 26, 26, 0.95);
    backdrop-filter: blur(20px);
    padding: 3rem 2.5rem;
    border-radius: 20px;
    border: 2px solid rgba(76, 255, 76, 0.3);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(76, 255, 76, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    width: 100%;
    max-width: 420px;
    position: relative;
    z-index: 1;
  }
  
  .logo-section {
    text-align: center;
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(76, 255, 76, 0.2);
  }
  
  h1 {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    font-weight: 700;
    color: #4cff4c;
    margin: 0;
    text-shadow: 0 0 20px rgba(76, 255, 76, 0.3);
    letter-spacing: 2px;
  }
  
  .subtitle {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 300;
    font-style: italic;
    margin-top: 0.5rem;
    letter-spacing: 1px;
  }
  
  .field {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.7rem;
    color: #4cff4c;
    font-weight: 500;
    font-size: 0.95rem;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  
  input {
    width: 100%;
    padding: 1rem 1.2rem;
    background: rgba(26, 26, 26, 0.8);
    border: 2px solid rgba(76, 255, 76, 0.2);
    border-radius: 12px;
    font-size: 1rem;
    color: #ffffff;
    box-sizing: border-box;
    transition: all 0.3s ease;
    font-family: 'Inter', sans-serif;
  }
  
  input::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  
  input:focus {
    outline: none;
    border-color: #4cff4c;
    box-shadow: 
      0 0 0 3px rgba(76, 255, 76, 0.2),
      0 0 20px rgba(76, 255, 76, 0.1);
    background: rgba(26, 26, 26, 0.95);
  }
  
  .register-btn {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #4cff4c 0%, #39d939 100%);
    color: #1a1a1a;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 
      0 4px 15px rgba(76, 255, 76, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    font-family: 'Inter', sans-serif;
  }
  
  .register-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #39d939 0%, #2eb82e 100%);
    transform: translateY(-2px);
    box-shadow: 
      0 8px 25px rgba(76, 255, 76, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  
  .register-btn:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 
      0 4px 15px rgba(76, 255, 76, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  
  .register-btn:disabled {
    background: rgba(76, 255, 76, 0.3);
    color: rgba(26, 26, 26, 0.6);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  .error {
    color: #ff4757;
    background: rgba(255, 71, 87, 0.1);
    border: 1px solid rgba(255, 71, 87, 0.3);
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    backdrop-filter: blur(10px);
  }
  
  .success {
    color: #4cff4c;
    background: rgba(76, 255, 76, 0.1);
    border: 1px solid rgba(76, 255, 76, 0.3);
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    backdrop-filter: blur(10px);
  }
  
  .login-link {
    text-align: center;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(76, 255, 76, 0.2);
  }
  
  .login-link a {
    color: #4cff4c;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    font-size: 0.95rem;
  }
  
  .login-link a:hover {
    color: #39d939;
    text-shadow: 0 0 10px rgba(76, 255, 76, 0.5);
  }
  
  @media (max-width: 480px) {
    .login-card {
      margin: 1rem;
      padding: 2rem 1.5rem;
    }
    
    h1 {
      font-size: 2rem;
    }
  }
</style>