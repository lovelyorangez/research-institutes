// app.js
document.addEventListener('DOMContentLoaded', () => {
  /* ------------------ DOM HOOKS ------------------ */
  const statePaths        = document.querySelectorAll('#mysvg path');
  const panelContent      = document.getElementById('panel-content');
  const stateTitle        = document.getElementById('state-title');
  const togglePanelBtn    = document.getElementById('toggle-state-panel');
  const searchInput       = document.getElementById('search-input');
  const searchResultsBox  = document.getElementById('search-results');

  /* ------------------ MAP INTERACTIONS ------------------ */
  statePaths.forEach(path => {
    const stateName     = path.getAttribute('name');
    const originalFill  = path.style.fill || window.getComputedStyle(path).fill;
    path.dataset.originalFill = originalFill;

    /* mouse behaviour */
    path.addEventListener('mouseenter', () => {
      path.style.transition = 'fill .25s ease';
      path.style.fill = '#10b981';          // emerald highlight
    });
    path.addEventListener('mouseleave', () => {
      path.style.fill = path.dataset.originalFill;
    });
    path.addEventListener('click', () => handleStateClick(stateName));

    /* accessible tooltip */
    const titleTag      = document.createElementNS('http://www.w3.org/2000/svg','title');
    titleTag.textContent = stateName;
    path.appendChild(titleTag);
  });

  /* ------------------ PANEL TOGGLE ------------------ */
  togglePanelBtn.addEventListener('click', () => {
    panelContent.classList.toggle('collapsed');
    togglePanelBtn.textContent = panelContent.classList.contains('collapsed') ? '+' : '−';
  });

  /* ------------------ STATE CLICK ------------------ */
  async function handleStateClick(stateName){
    stateTitle.textContent = `Institutions in ${stateName}`;
    panelContent.innerHTML = '<p style="padding:6px 2px;">Loading…</p>';

    try{
      const res   = await fetch(`/api/byState?state=${encodeURIComponent(stateName)}`);
      const data  = await res.json();

      if(!Array.isArray(data) || !data.length){
        panelContent.innerHTML = '<p>No institutions found.</p>';
        return;
      }

      panelContent.innerHTML = '';
      data.forEach(name => {
        const div = document.createElement('div');
        div.className = 'institution-item';
        div.textContent = name;
        div.onclick = () => showInstitution(name);
        panelContent.appendChild(div);
      });

    }catch(err){
      console.error(err);
      panelContent.innerHTML = '<p style="color:#ef4444;">Error loading data.</p>';
    }
  }

  /* ------------------ SEARCH ------------------ */
  const debounce = (fn, delay = 300) => {
    let t; return (...args) => { clearTimeout(t); t=setTimeout(()=>fn(...args),delay);};
  };

  searchInput.addEventListener('input', debounce(async () => {
    const q = searchInput.value.trim().toLowerCase();
    searchResultsBox.innerHTML = '';
    if(!q) return;

    try{
      const res  = await fetch('/api/allInstitutions');
      const all  = await res.json();
      const hits = all.filter(n => n.toLowerCase().includes(q));

      if(!hits.length){
        searchResultsBox.innerHTML = '<p style="padding:4px 2px;">No matching institutions.</p>';
        return;
      }
      hits.forEach(name => {
        const div = document.createElement('div');
        div.className = 'institution-item';
        div.textContent = name;
        div.onclick = () => showInstitution(name);
        searchResultsBox.appendChild(div);
      });
    }catch(err){
      console.error(err);
      searchResultsBox.innerHTML = '<p style="color:#ef4444;">Search failed.</p>';
    }
  }));

  /* ------------------ DETAILS PAGE ------------------ */
  function showInstitution(name){
    window.open(`institution.html?name=${encodeURIComponent(name)}`,'_blank');
  }
});
