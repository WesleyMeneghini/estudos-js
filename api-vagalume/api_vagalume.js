const $conteudo = document.getElementById("conteudo");
const $artista = document.getElementById("artista");
const $nomeArtista = document.getElementById("nome_artista");
const $imgArtista = document.getElementById("container_img_artista");
const $tblMusicas = document.getElementById("musicas");
const $btnBuscar = document.getElementById("btn_buscar");
const $bkgDadosArtista = document.getElementById("dados_artista");
const $msgErro = document.getElementById("msg_erro");
const $letraDaMusica = document.getElementById("letra_da_musica");
const $linkVagalume = "https://www.vagalume.com.br";

let urlArtista = "";

const limparArtista = () =>{
    console.log("teste")
    $nomeArtista.innerHTML = "";
    $bkgDadosArtista.style.backgroundImage = "";
    $imgArtista.innerHTML = "";
    $tblMusicas.innerHTML = "";
    return $msgErro.innerHTML = `<h4 class='txt-center'>Nenhum resultado para <span class='erro'>${$artista.value}</span></h4>`;
}

const erroArtista = (nome, elemento) =>{
    // alert("entrou");
    limparArtista();
}



const encontrarArtista = (artista) => {

    console.log($bkgDadosArtista);


    //sempre que houver um espaço substituir por traço
    artista = artista.replace(/ /g, "-");
    artista = artista.replace(/ç/g, "c");
    artista = artista.toLowerCase();
    // alert(artista);
    
    urlArtista = `${$linkVagalume}/${artista}/index.js`;
    // alert(urlArtista);

    if(artista != ""){
        
        // passo uma promise. Se nao achar o a url retorna erro para o .catch() que chama uma funcao para mostrar esse erro no html
        const dp = fetch(urlArtista)
            .then( res => res.json())
            .then( res => mostrarArtista(res))
            .catch( () => erroArtista());

    }else{
        // mensagem de alerta para caixa vazia
        alert("Escolha um nome de um artista!");
    }
    
    const mostrarArtista = (json) =>{
        console.log(json);
        
        // pegar nome do artista 
        $nomeArtista.innerHTML = `<h1>${json.artist.desc}</h1>`

        // pegar foto do artista no menor formato
        let linkFotoSmall = json.artist.pic_small;
        // pegar foto do artista no maior formato
        let linkFotoMedium = json.artist.pic_medium;

        // adicionar o link da foto com o link do vagalume
        const fotoMenor = $linkVagalume + linkFotoSmall;
        const fotoMaior = $linkVagalume + linkFotoMedium;

        // colocando foto no maior formato como background 
        $bkgDadosArtista.style.backgroundImage = `url(${fotoMaior})`;

        // colocando foto na estrutura html
        $imgArtista.innerHTML = `<img class='bkg-img visivel' src='${fotoMenor}'/>`;

        // pegando top musicas
        let musicasArray = json.artist.toplyrics.item;
        
        let contadora = 0;
        const musica = (acc, json) =>{
            contadora += 1;
            return acc + 
                            `<tr>
                                <td class='txt-center'>${contadora}</td>
                                <td class='txt-center td_musicas' id='${contadora}'>${json.desc}</td>
                            </tr>`;
        }

        let elementosTbl = `<tr id='tr_principal'>
                                <td id='td_principal' class='txt-center' width='10%'>TOP</td>
                                <td id='td_principal' class='txt-center' width='90%'>MUSICAS</td>
                            </tr>`;

        let topMusicas = musicasArray.reduce(musica , elementosTbl, musicasArray);

        // colocar as top musicas na tabela
        $tblMusicas.innerHTML = topMusicas;
        $msgErro.innerHTML = "";
        
        
    }

}

const buscarMusica = (link) =>{
    console.log(link);

    const promiseMusica = fetch(link)
            .then( res => res.json())
            .then( res => mostrarMusica(res));

    const mostrarMusica = (json) =>{
        console.log(json);

        let titleMusica = json.mus[0].name;
        let letraMusicaPromisse = json.mus[0].text;

        letraMusicaPromisse = letraMusicaPromisse.replace(/\n/g, "<br>");

        $letraDaMusica.innerHTML = letraMusicaPromisse;
        console.log($letraDaMusica);
        
    }
}

let linkMusica = "";
const letraMusica = (musica) =>{
    console.log(musica);
    musica = musica.replace(/ /g, "-");
    musica = musica.toLowerCase();
    console.log(musica);
    linkMusica = "https://api.vagalume.com.br/search.php?art=" + $artista.value + "&mus=" + musica;
    buscarMusica(linkMusica);
}

const pegarMusica = (elemento) => {
    console.log(elemento.target.innerText);
    let musica = elemento.target.innerText;
    letraMusica(musica);
    $tblMusicas.classList.add = "trasition";
}

// pegar o nome do artista no click do botao buscar
$btnBuscar.addEventListener('click', () => encontrarArtista($artista.value));

$tblMusicas.addEventListener('click', ( e ) => pegarMusica( e ));



