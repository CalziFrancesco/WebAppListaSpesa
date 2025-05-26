<script>
  let username = $state('');
  let password = $state('');
  let isLoading = $state(false);
  let error = $state('');
  import {goto} from '$app/navigation'

  async function handleLogin(event) {
    event.preventDefault();
    
    if (!username || !password) {
        error = 'Inserisci username e password';
        return;
    }

    isLoading = true;
    error = '';

    try {
        const res = await fetch('https://backendls-1.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include' 
        });

        if (!res.ok) {
            const data = await res.json();
            error = data.message || 'Errore durante il login';
            return;
        }
        if (username=="Admin"){
          goto('/admin')
        }else{
          goto('/home')
        }
    } catch (err) {
        error = 'Errore di rete durante il login';
    } finally {
        isLoading = false;
    }
}
</script>

<svelte:head>
  <title>Accedi - LISTIFY</title>
</svelte:head>

<main class="login-container">
  <div class="login-card">
    <div class="logo-section">
      <h1>LISTIFY</h1>
      <div class="subtitle">Eleganza digitale</div>
    </div>
    
    <form onsubmit={handleLogin}>
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

      <button type="submit" disabled={isLoading} class="login-btn">
        {isLoading ? 'Accesso in corso...' : 'Accedi'}
      </button>
    </form>

    <p class="register-link">
      <a href="/registrazione">Non hai un account? Registrati</a>
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
      radial-gradient(circle at 25% 25%, rgba(76, 255, 76, 0.12) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(76, 255, 76, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(76, 255, 76, 0.05) 0%, transparent 50%);
    animation: pulse 4s ease-in-out infinite;
    z-index: 0;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  
  .login-card {
    background: rgba(26, 26, 26, 0.95);
    backdrop-filter: blur(20px);
    padding: 3.5rem 2.5rem;
    border-radius: 20px;
    border: 2px solid rgba(76, 255, 76, 0.3);
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(76, 255, 76, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    width: 100%;
    max-width: 420px;
    position: relative;
    z-index: 1;
    transform: translateY(0);
    transition: transform 0.3s ease;
  }
  
  .login-card:hover {
    transform: translateY(-5px);
  }
  
  .logo-section {
    text-align: center;
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(76, 255, 76, 0.2);
    position: relative;
  }
  
  .logo-section::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #4cff4c, transparent);
    box-shadow: 0 0 10px rgba(76, 255, 76, 0.5);
  }
  
  h1 {
    font-family: 'Playfair Display', serif;
    font-size: 3rem;
    font-weight: 700;
    color: #4cff4c;
    margin: 0;
    text-shadow: 
      0 0 20px rgba(76, 255, 76, 0.4),
      0 0 40px rgba(76, 255, 76, 0.2);
    letter-spacing: 3px;
    animation: glow 2s ease-in-out infinite alternate;
  }
  
  @keyframes glow {
    from {
      text-shadow: 
        0 0 20px rgba(76, 255, 76, 0.4),
        0 0 40px rgba(76, 255, 76, 0.2);
    }
    to {
      text-shadow: 
        0 0 25px rgba(76, 255, 76, 0.6),
        0 0 50px rgba(76, 255, 76, 0.3);
    }
  }
  
  .subtitle {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 300;
    font-style: italic;
    margin-top: 0.8rem;
    letter-spacing: 1.5px;
  }
  
  .field {
    margin-bottom: 2rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.8rem;
    color: #4cff4c;
    font-weight: 500;
    font-size: 0.95rem;
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }
  
  input {
    width: 100%;
    padding: 1.2rem 1.5rem;
    background: rgba(26, 26, 26, 0.8);
    border: 2px solid rgba(76, 255, 76, 0.2);
    border-radius: 15px;
    font-size: 1.1rem;
    color: #ffffff;
    box-sizing: border-box;
    transition: all 0.4s ease;
    font-family: 'Inter', sans-serif;
  }
  
  input::placeholder {
    color: rgba(255, 255, 255, 0.4);
    font-style: italic;
  }
  
  input:focus {
    outline: none;
    border-color: #4cff4c;
    box-shadow: 
      0 0 0 4px rgba(76, 255, 76, 0.2),
      0 0 30px rgba(76, 255, 76, 0.15);
    background: rgba(26, 26, 26, 0.95);
    transform: scale(1.02);
  }
  
  .login-btn {
    width: 100%;
    padding: 1.3rem;
    background: linear-gradient(135deg, #4cff4c 0%, #39d939 100%);
    color: #1a1a1a;
    border: none;
    border-radius: 15px;
    font-size: 1.2rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.4s ease;
    text-transform: uppercase;
    letter-spacing: 2px;
    box-shadow: 
      0 8px 25px rgba(76, 255, 76, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
  }
  
  .login-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s;
  }
  
  .login-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #39d939 0%, #2eb82e 100%);
    transform: translateY(-3px);
    box-shadow: 
      0 15px 35px rgba(76, 255, 76, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  
  .login-btn:hover:not(:disabled)::before {
    left: 100%;
  }
  
  .login-btn:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 
      0 8px 25px rgba(76, 255, 76, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  
  .login-btn:disabled {
    background: rgba(76, 255, 76, 0.2);
    color: rgba(26, 26, 26, 0.5);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  .error {
    color: #ff4757;
    background: rgba(255, 71, 87, 0.1);
    border: 1px solid rgba(255, 71, 87, 0.3);
    padding: 1.2rem;
    border-radius: 10px;
    margin-bottom: 2rem;
    font-size: 0.95rem;
    backdrop-filter: blur(10px);
    animation: shake 0.5s ease-in-out;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  .register-link {
    text-align: center;
    margin-top: 2.5rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(76, 255, 76, 0.2);
    position: relative;
  }
  
  .register-link::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #4cff4c, transparent);
    box-shadow: 0 0 10px rgba(76, 255, 76, 0.5);
  }
  
  .register-link a {
    color: #4cff4c;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    font-size: 1rem;
    position: relative;
  }
  
  .register-link a::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #4cff4c, #39d939);
    transition: width 0.3s ease;
  }
  
  .register-link a:hover {
    color: #39d939;
    text-shadow: 0 0 10px rgba(76, 255, 76, 0.5);
  }
  
  .register-link a:hover::after {
    width: 100%;
  }
  
  @media (max-width: 480px) {
    .login-card {
      margin: 1rem;
      padding: 2.5rem 1.5rem;
    }
    
    h1 {
      font-size: 2.2rem;
      letter-spacing: 2px;
    }
    
    input {
      padding: 1rem 1.2rem;
      font-size: 1rem;
    }
    
    .login-btn {
      padding: 1.1rem;
      font-size: 1.1rem;
    }
  }
</style>