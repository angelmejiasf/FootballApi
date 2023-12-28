// Crear clase para acceder a la api

class FootballApi {
  constructor(apiKey, apiHost) {
    this.apiKey = apiKey;
    this.apiHost = apiHost;
    this.requestOptions = {
      method: 'GET',
      headers: new Headers({
        "x-rapidapi-key": this.apiKey,
        "x-rapidapi-host": this.apiHost
      }),
      redirect: 'follow'
    };
  }

  // Obtener las ligas
  async getLeagues() {
    try {
      const response = await fetch("https://v3.football.api-sports.io/leagues", this.requestOptions);
      const result = await response.json();
      return result.response;
    } catch (error) {
      console.error('Error al obtener las ligas:', error);
      throw error;
    }
  }

  // Obtener los goleadores de la liga con el id seleccionado
  async getTopScorers(leagueId) {
    try {
      const response = await fetch(`https://v3.football.api-sports.io/players/topscorers?season=2023&league=${leagueId}`, this.requestOptions);
      const result = await response.json();
      return result.response;
    } catch (error) {
      console.error('Error al obtener los mejores goleadores:', error);
      throw error;
    }
  }
}

// Clase para los contenedores
class FootballApp {
  constructor(apiKey, apiHost) {
    this.footballApi = new FootballApi(apiKey, apiHost);
    this.ligasContainer = document.getElementById('ligas-container');
    this.detailsContainer = document.querySelector('.details-container');
  }

  async init() {
    const ligas = await this.footballApi.getLeagues();
    this.renderLeagues(ligas);
  }

  // Mostrar los datos de las ligas
  renderLeagues(ligas) {
    if (this.ligasContainer) {
      ligas.slice(2, 12).forEach(liga => {
        const nombreLiga = liga.league.name;
        const logoLiga = liga.league.logo;
        const idLiga = liga.league.id;

        const ligaDiv = document.createElement('div');
        ligaDiv.innerHTML = `<p>${nombreLiga}</p><img src="${logoLiga}" alt="${nombreLiga} Logo">`;

        ligaDiv.addEventListener('click', async () => {
          await this.renderTopScorers(idLiga);
        });

        this.ligasContainer.appendChild(ligaDiv);
      });
    }
  }

//  Mostrar los goleadores de cada liga seleccionada
  async renderTopScorers(leagueId) {
    const topScorers = await this.footballApi.getTopScorers(leagueId);

    this.detailsContainer.innerHTML = '<h2>Top Scorers</h2>';

    const playerGrid = document.createElement('div');
    playerGrid.classList.add('player-grid');

    topScorers.forEach(player => {
      const playerName = player.player.name;
      const goals = player.statistics[0].goals.total;
      const playerPhoto = player.player.photo;

      const playerCard = document.createElement('div');
      playerCard.classList.add('player-card');
      playerCard.innerHTML = `<p>${playerName} - ${goals} goles</p><img src="${playerPhoto}" alt="${playerName} Photo">`;

      playerGrid.appendChild(playerCard);
    });

    this.detailsContainer.appendChild(playerGrid);
  }
}


// Datos de la api
const apiKey = "62d4a4d37f280a99d8e42a7c5ed72fe6";
const apiHost = "v3.football.api-sports.io";
const footballApp = new FootballApp(apiKey, apiHost);
footballApp.init();