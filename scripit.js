const audioPlayer = document.getElementById("audioPlayer");
const checkButton = document.getElementById("check-button");
const resultMessage = document.getElementById("result-message");
const audio = document.getElementById('audio')

let player;
let trackName;
let pontos = 0;
let gameOver = 0;

var pontuacao = document.getElementById('pontos')

window.onSpotifyWebPlaybackSDKReady = () => {
  //Trocar o token abaixo a cada hora, precisa estar logado, através do link https://developer.spotify.com/documentation/web-playback-sdk/tutorials/getting-started 
  const token ="BQAgvVoQgj6wo0UL6A8z8mrnkaOHA2vYyHuKBZkpX6YoPAedzFLiF83C2wAhOvv3JXGpiDO0jdyP_3bWu-lH0QlWhEAsP9OqFm-pHC28AR-NmvJQwGSENKaRpBktlQEmU7UoJIniiYsvGS1YwUAu4j7P_O8Jy8f8Cnwuj1EoYfQbxzRpAQg6FBhPL2i8TVrVAy-1F1bmwThjVhk3E7-zmEONu7oU"
    player = new Spotify.Player({
    name: "Web Playback SDK Quick Start Player",
    getOAuthToken: (cb) => {
      cb(token);
    },
    volume: 1.0,
  });
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    const connect_to_device = () => {
      let album_uri = "spotify:playlist/0z5i04ub1ojThMAjmuRXpf";
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
        method: "PUT",
        body: JSON.stringify({
          context_uri: album_uri,
          play: false,
        }),
        headers: new Headers({
            "Authorization": "Bearer " + token,
        }),
    }).then(response => console.log(response))
    .then(data => {
      // Adicionar listener para o evento de mudança de estado de reprodução
      player.addListener('player_state_changed', ({
        track_window
      }) => {
        trackName = track_window.current_track.name;
        trackName = trackName.toLowerCase();
        console.log('Current Track:', trackName);
      });})}
    connect_to_device();
  });

//botão play music para tocar a musica por 13 segundos
audioPlayer.addEventListener('click',() => {
    player.togglePlay();
    setTimeout(() => {
      player.pause();
    }, 20000);

  });
  
//botão resposta para verificar se a resposta está correta apagar a resposta e mudar a musica do play-music para a proxima
 checkButton.addEventListener('click',(event) => {
  event.preventDefault();
  let resposta = document.getElementById("resposta").value;
  resposta = resposta.toLowerCase();
  if (resposta == trackName) {
    alert("Você Acertou, Parabéns!");
    resultMessage.textContent = 'Você acertou!';
      pontos += 10;
      pontuacao.textContent = pontos
    document.getElementById("resposta").value = "";
        player.nextTrack();
        setTimeout(() => {
        player.pause();
        }, 20000);

       

      } else {
        alert("Você errou, tente novamente!");

      pontos -= 5;
      pontuacao.textContent = pontos
      gameOver++
      
        resultMessage.textContent = 'Você errou'
      }

     if(gameOver===3){
         alert('Game Over');
         window.open('game_over.html');
     }
    });
  player.connect(); 
  
  // Armazenar a variável 'pontos' no localStorage
  localStorage.setItem("pontos", pontos);

};

