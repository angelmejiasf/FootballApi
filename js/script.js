class Competitions {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.football-data.org/v4/competitions/';
  }

  async getCompetitions() {
    try {
      const response = await fetch(this.apiUrl, {
        headers: {
          'X-Auth-Token': this.apiKey
        }
      });



      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async getCompetitionDetails(competitionCode) {
    try {
      const response = await fetch(`${this.apiUrl}${competitionCode}`, {
        headers: {
          'X-Auth-Token': this.apiKey
        }
      });

     

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

// Uso de la clase
const apiKey = '17c5405350aa42ba92590010d4b993d7';
const competitionsApi = new Competitions(apiKey);



competitionsApi.getCompetitions()
  .then((competitionsData) => {
    // Datos de todo el api
    console.log(competitionsData.competitions);
    if (competitionsData && competitionsData.competitions && Array.isArray(competitionsData.competitions)) {
      const competitionsArray = competitionsData.competitions;

      if (competitionsArray.length > 0) {
        const container = document.createElement('div'); 
        container.classList.add('cards-container'); 

        competitionsArray.forEach((competition) => {
          // Crear tarjeta
          const card = document.createElement('div');
          card.classList.add('card'); 

          // Crear H4 y la imagen
          const pElement = document.createElement('h4');
          const imgElement = document.createElement('img');

          // Mostrar nombre y logo
          pElement.textContent = competition.name;
          imgElement.src = competition.emblem;
          imgElement.alt = 'Emblema de la competición';
          imgElement.classList.add("logo");

          
          card.appendChild(pElement);
          card.appendChild(imgElement);

          // Obtener el code de cada tarjeta/competicion
          card.setAttribute('data-competition-code', competition.code);

          
          container.appendChild(card);
        });

        // Agregar el contenedor al cuerpo del documento
        document.body.appendChild(container);

        // Agregar evento de clic a cada tarjeta
        document.querySelectorAll('.card').forEach(card => {
          card.addEventListener('click', function() {
            const competitionCode = this.getAttribute('data-competition-code');

            // Obtén información detallada sobre la competición al hacer clic
            competitionsApi.getCompetitionDetails(competitionCode)
              .then((specificCompetitionData) => {
                
                
                showCompetitionDetails(specificCompetitionData);
              })
             
          });
        });
      }
    }
  })
  

// Función para mostrar los detalles de la competición
function showCompetitionDetails(competitionDetails) {
  // Datos de la competicion
  console.log('Detalles de la competición:', competitionDetails);

  let detailsContainer = document.querySelector('.competition-details');
  if (!detailsContainer) {
    // Creacion de un div para mostrar los contenidos
    detailsContainer = document.createElement('div');
    detailsContainer.classList.add('competition-details'); 
    document.body.appendChild(detailsContainer);
  } else {
    // Si ya existe algo dentro, borrarlo y mostrar el nuevo
    detailsContainer.innerHTML = '';
  }
  

   // Mostrar información de temporadas y ganadores
   if (competitionDetails.seasons && Array.isArray(competitionDetails.seasons)) {
    const seasonsContainer = document.createElement('div');
    seasonsContainer.classList.add('seasons-container');
    detailsContainer.appendChild(seasonsContainer);

    competitionDetails.seasons.forEach((season) => {
      // Creacion del div
      const seasonElement = document.createElement('div');
      seasonElement.classList.add('season');

      const seasonTitle = document.createElement('h4');
      seasonTitle.textContent = `Año: ${new Date(season.startDate).getFullYear()}`;

      seasonElement.appendChild(seasonTitle);

      // Mostrar los datos
      if (season.winner) {
        const winnerElement = document.createElement('div');
        winnerElement.classList.add('winner');

        const winnerName = document.createElement('p');
        winnerName.textContent = `Ganador: ${season.winner.name}`;
        winnerElement.appendChild(winnerName);

        const winnerCrest = document.createElement('img');
        winnerCrest.src = season.winner.crest;
        winnerCrest.alt = 'Escudo/bandera ganador';
        winnerCrest.classList.add('crest-image');
        winnerElement.appendChild(winnerCrest);

        seasonElement.appendChild(winnerElement);
      }

      seasonsContainer.appendChild(seasonElement);
    });
  }
}
