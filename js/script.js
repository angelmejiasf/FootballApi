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

document.addEventListener('DOMContentLoaded', function () {
  const mainContainer = document.getElementById('main');

  // Crear instancia de la clase Competitions
  const apiKey = '17c5405350aa42ba92590010d4b993d7';
  const competitionsApi = new Competitions(apiKey);

  // Función para agregar una tarjeta al contenedor
  function addCardToContainer(competition) {
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
    imgElement.classList.add('logo');

    card.appendChild(pElement);
    card.appendChild(imgElement);

    // Obtener el code de cada tarjeta/competicion
    card.setAttribute('data-competition-code', competition.code);

    // Agregar la tarjeta al contenedor principal
    mainContainer.appendChild(card);

    // Agregar evento de clic a cada tarjeta
    card.addEventListener('click', function () {
      const competitionCode = this.getAttribute('data-competition-code');

      // Obtén información detallada sobre la competición al hacer clic
      competitionsApi.getCompetitionDetails(competitionCode)
        .then((specificCompetitionData) => {
          showCompetitionDetails(specificCompetitionData);
        })
        .catch((error) => {
          console.error('Error en la solicitud de la competición específica:', error);
        });
    });
  }


  // Función para mostrar los detalles de la competición
  function showCompetitionDetails(competitionDetails) {
    // Datos de la competición
    console.log('Detalles de la competición:', competitionDetails);

    // Obtener el contenedor de detalles
    const detailsContainer = document.querySelector('.details-container');


    detailsContainer.innerHTML = '';

    // Mostrar información de temporadas y ganadores
    if (competitionDetails.seasons && Array.isArray(competitionDetails.seasons)) {
      const detailsContainer = document.querySelector('.details-container');

      competitionDetails.seasons.forEach((season) => {
        // Creación del div
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

        detailsContainer.appendChild(seasonElement);
      });
    }
  }

  // Obtener y mostrar las competiciones
  competitionsApi.getCompetitions()
    .then((competitionsData) => {
      if (competitionsData && competitionsData.competitions && Array.isArray(competitionsData.competitions)) {
        const competitionsArray = competitionsData.competitions;

        if (competitionsArray.length > 0) {
          competitionsArray.forEach(addCardToContainer);
        }
      }
    })
    .catch((error) => {
      console.error('Error en la solicitud:', error);
    });
});
