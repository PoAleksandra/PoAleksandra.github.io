const pageContainer = document.getElementsByClassName('page-container')[0],
      charactersBlock = document.getElementsByClassName('main-block')[0],     
      scrollToTopBtn = document.getElementsByClassName('scroll-btn')[0],
      selectorBlock = document.getElementsByClassName('selector-block')[0];

let pageCounter,
    allCharactersArr = [],
    pageNumber;

window.onload = () => {
  pageCounter = 1;
  renderSelectorBlock();
  pageRender(pageCounter);
}

window.onscroll = () => {
  const toggleBtn = document.getElementsByClassName('switch-btn')[0];

  if (!toggleBtn.classList.contains('switch-on')) {
    scrollCheck();
  } 
};

const scrollCheck = () => {
  const documentHeight = document.body.offsetHeight,
        screenHeight = window.innerHeight,
        scrolled = window.scrollY,
        limit = documentHeight - screenHeight/4,
        bottomPosition = scrolled + screenHeight;

  if ((bottomPosition >= limit) && (pageCounter <= pageNumber)) {  
    pageCounter + 1;
    pageRender(pageCounter); 
  };  
}

const pageRender = (pageCounter) => {
  let ajaxRequest = new XMLHttpRequest();

  ajaxRequest.open('GET', `https://rickandmortyapi.com/api/character?page=${pageCounter}`);

  ajaxRequest.send();

  ajaxRequest.onload = function () {
    try {
      let charactersData = JSON.parse(this.response).results;
      pageNumber = JSON.parse(this.response).info.pages;

      charactersData.forEach(newCharacter => {
        allCharactersArr.push(newCharacter);
      })

      renderCharacters(charactersData);   
    } catch {
        showError(JSON.parse(this.response).error);
    }
  };

  ajaxRequest.onerror = function () {
    showError(JSON.parse(this.response).error);
  };
}

const renderCharacters = charactersData => {
  charactersData.forEach(character => {
    
    charactersBlock.innerHTML +=
      `<div id="${character.id}" class="character-box">  
        <img src="${character.image}" class="character-img">
        <p>${character.name}</p>
      </div>`;
  });
}

charactersBlock.addEventListener('click', event => {
  let target = event.target,
      idNumber;

  if (target.classList.contains('character-box') || target.parentElement.classList.value === 'character-box') {
    idNumber = target.id || +target.parentElement.id;

    renderCharacterInfo(allCharactersArr, idNumber);
  }
});

const renderCharacterInfo = (allCharactersArr, idNumber) => {
  let requestedCharacter = allCharactersArr.find((character) => {
    return +idNumber === +character.id;
  });
  
  charactersBlock.innerHTML += `
      <div class="shadow-background">
        <div class="character-container">
          <button class="btn-close">Close</button>
      
          <div class="info-box">  
              <img src="${requestedCharacter.image}" class="character-img">
        
              <div class="characteristics">
                <div>
                  <h3 class="specification">Name:</h3>
                  <p>${requestedCharacter.name}</p>
                </div>
          
                <div>
                  <h3 class="specification">Status:</h3>
                  <p>${requestedCharacter.status}</p>
                </div>
          
                <div>
                  <h3 class="specification">Species:</h3>
                  <p>${requestedCharacter.species}</p>
                </div>
          
                <div>
                  <h3 class="specification">Origin:</h3>
                  <p>${requestedCharacter.origin.name}</p>
                </div>
          
                <div>
                  <h3 class="specification">Location:</h3>
                  <p>${requestedCharacter.location.name}</p>
                </div>
          
                <div>
                  <h3 class="specification">Gender:</h3>
                  <p>${requestedCharacter.gender}</p>
                </div>
              </div>  
          </div>
        </div> 
      </div>
      `;
      document.body.style.overflowY = 'hidden';
      closeInfoWindow();
}

const closeInfoWindow = () => {
  const buttonClose = document.getElementsByClassName('btn-close')[0];

  buttonClose.addEventListener('click', () => {
    buttonClose.parentElement.parentElement.remove();
    
    document.body.style.overflowY = 'visible';
  });
}

scrollToTopBtn.onclick = () => {
  scrollTo ({
    top: 0,
    bottom: 0,
    behavior: "smooth"
  });
}

const showError = (text) => {
  pageContainer.innerHTML = 
  `<div class="error">
     <p>An error occured while loading data: ${text}</p>
   </div>`;
}

const renderSelectorBlock = () => {
  selectorBlock.innerHTML =
 `<div class="switch-block">
    <div class="switch-btn"></div>
    <p>Select a page</p>
  </div>

  <div class="pagination-block"></div>`;

  toggleSelector(document.getElementsByClassName('switch-btn')[0]);
}

const toggleSelector = toggleBtn => {
  const paginatorBlock = document.getElementsByClassName('pagination-block')[0];

  toggleBtn.addEventListener('click', () => {
    if (toggleBtn.classList.contains('switch-on')) {
      toggleBtn.classList.remove('switch-on');
      paginatorBlock.innerHTML = '';

    } else {
      toggleBtn.classList.add('switch-on');
      renderPaginator (pageNumber);
    }    
  })  
}

const renderPaginator = pageNumber => {
  const paginatorBlock = document.getElementsByClassName('pagination-block')[0];

  paginatorBlock.innerHTML += `
  <button class="to-previous">Previous</button>
    <div class="pages"></div>
  <button class="to-next">Next</button>`;


  const pages = paginatorBlock.getElementsByClassName('pages')[0],
        prevBtn = document.getElementsByClassName('to-previous')[0];
  
  prevBtn.disabled = 'true';

  for (let i = 1; i <= pageNumber; i++) {
    pages.innerHTML += `<button id="${i}">${i}</button>`
  }

  setActionsToPaginator(paginatorBlock);
  setActiveTab(document.getElementById(pageCounter), paginatorBlock);
}


const setActionsToPaginator = paginatorBlock => {
  const nextBtn = document.getElementsByClassName('to-next')[0],
        prevBtn = document.getElementsByClassName('to-previous')[0];

  paginatorBlock.onclick = event => {
    const target = event.target;

    if (target.classList.contains('to-next') && target.tagName === 'BUTTON') {
      setActionToNextBtn (target, prevBtn, paginatorBlock);
    }

    if (target.classList.contains('to-previous') && target.tagName === 'BUTTON') {
      setActionToPrevBtn (target, nextBtn, paginatorBlock);
    }
    
    if (target.tagName === 'BUTTON' && target.id) {
      charactersBlock.innerHTML = '';

      pageRender(target.id);
      setActiveTab(target, paginatorBlock);

      pageCounter = target.id;
      
      (+pageCounter === +pageNumber) ? nextBtn.disabled = 'true' : nextBtn.disabled = false;
      (+pageCounter === 1) ? prevBtn.disabled = 'true' : prevBtn.disabled = false;
    }
  }
}


const setActionToNextBtn = (target, prevBtn, paginatorBlock) => {
  if ((+pageCounter === (pageNumber-1)) ) {
    target.disabled = 'true';
  } 
 
  prevBtn.disabled = false;
  pageCounter++;

  charactersBlock.innerHTML = '';
  pageRender(pageCounter);
 
  let activeTab = document.getElementById(`${pageCounter}`);
  setActiveTab(activeTab, paginatorBlock);
}

const setActionToPrevBtn = (target, nextBtn, paginatorBlock) => {
  (+pageCounter === 2) ? target.disabled = 'true' : target.disabled = false;

  nextBtn.disabled = false;
  pageCounter--;

  charactersBlock.innerHTML = '';
  pageRender(pageCounter);

  let activeTab = document.getElementById(`${pageCounter}`);
  setActiveTab(activeTab, paginatorBlock);
}

const setActiveTab = (target, paginatorBlock) => { 
  if (!paginatorBlock.getElementsByClassName('active')[0]) {
    target.classList.add('active');
  } else {
    paginatorBlock.getElementsByClassName('active')[0].classList.remove('active');
    target.classList.add('active');
  }
}