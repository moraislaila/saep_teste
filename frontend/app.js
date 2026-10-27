// front do StreamFlix: galeria, login, perfil e cadastro de filmes
const $ = id => document.getElementById(id);
const esc = txt => String(txt).replace(/[&<>"']/g, c => '&#' + c.charCodeAt(0) + ';');
const post = (url, corpo) => fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
});

let usuario = JSON.parse(localStorage.getItem('usuario'));
let filmes = [];
let verMeus = false; // true na tela de cadastro

// galeria: 3 colunas, as linhas aparecem sozinhas
async function carregarFilmes() {
    const resp = await fetch('/api/filmes?id_usuario=' + (usuario ? usuario.id_usuario : ''));
    filmes = await resp.json();
    mostrarFilmes();
}

function mostrarFilmes() {
    const nome = $('busca').value.trim().replace('@', '').toLowerCase();
    $('erroBusca').textContent = '';

    if (!verMeus && !/^\w*$/.test(nome)) {
        $('erroBusca').textContent = 'Formato inválido (exemplo: curador1)';
        return;
    }

    const lista = verMeus
        ? filmes.filter(f => f.id_usuario === usuario.id_usuario)
        : filmes.filter(f => f.admin.toLowerCase().includes(nome));
    if (!verMeus && nome && !lista.length) $('erroBusca').textContent = 'Administrador não encontrado';

    $('galeria').innerHTML = lista.map(f => `
        <div class="card">
            <div class="capa">
                <img src="/${esc(f.url_capa)}" alt="${esc(f.titulo_filme)}">
                ${verMeus ? '' : `<div class="dica">Cadastrado por: @${esc(f.admin)}<br>Gênero: ${esc(f.genero)}</div>`}
            </div>
            <div class="card-baixo">
                <span>${esc(f.titulo_filme)}</span>
                ${verMeus
                    ? `<button class="lixeira" data-id="${f.id_filme}"></button>`
                    : `<button class="curtir" data-id="${f.id_filme}">
                           <span class="coracao ${f.curtido ? 'curtido' : ''}"></span>${f.curtidas}
                       </button>`}
            </div>
        </div>`).join('') || '<p class="vazio">Nenhum filme encontrado</p>';
}

// curtir ou excluir
$('galeria').addEventListener('click', async e => {
    const botao = e.target.closest('button');
    if (!botao) return;

    if (!botao.classList.contains('curtir')) {
        await fetch('/api/filmes/' + botao.dataset.id, { method: 'DELETE' });
    } else if (usuario) {
        await post('/api/curtidas', { id_usuario: usuario.id_usuario, id_filme: botao.dataset.id });
    } else {
        return abrirLogin();
    }
    carregarFilmes();
});

// sem login a busca abre o modal
$('busca').addEventListener('focus', () => {
    if (!usuario) {
        $('busca').blur();
        abrirLogin();
    }
});
$('busca').addEventListener('input', mostrarFilmes);

// login
function abrirLogin() {
    $('loginUsuario').value = '';
    $('loginSenha').value = '';
    ['erroUsuario', 'erroSenha', 'erroLogin'].forEach(id => $(id).textContent = '');
    $('modal').showModal();
}

// o botão do topo é login ou logout
$('btnLogin').addEventListener('click', () => {
    if (!usuario) return abrirLogin();
    localStorage.removeItem('usuario');
    location.href = '/';
});
['fecharModal', 'btnCancelar'].forEach(id => $(id).addEventListener('click', () => $('modal').close()));

$('btnEntrar').addEventListener('click', async () => {
    const nome_usuario = $('loginUsuario').value.trim();
    const senha = $('loginSenha').value;

    $('erroUsuario').textContent = nome_usuario.length < 3 ? 'O nome_usuario deve ter no mínimo 3 caracteres' : '';
    $('erroSenha').textContent = senha ? '' : 'A senha é obrigatória';
    $('erroLogin').textContent = '';
    if (nome_usuario.length < 3 || !senha) return;

    const resp = await post('/api/login', { nome_usuario, senha });
    if (!resp.ok) {
        $('erroLogin').textContent = 'Usuário não encontrado ou senha incorreta';
        return;
    }

    usuario = await resp.json();
    localStorage.setItem('usuario', JSON.stringify(usuario));
    $('modal').close();
    atualizarTela();
    carregarFilmes();
});

// cabeçalho conforme o usuário logado ("Ver Perfil" só para administrador)
function atualizarTela() {
    const admin = usuario && usuario.tipo === 'administrador';
    $('btnPerfil').disabled = Boolean(usuario) && !admin;
    $('btnPerfil').classList.toggle('desativado', !admin);
    $('busca').placeholder = usuario ? 'Digite o nome do administrador' : 'Digite o nome do administrador... ex: @curador1';
    if (!usuario) return;

    $('foto').src = '/imagens/perfil/' + usuario.imagem_usuario;
    $('nome').textContent = usuario.nome;
    $('btnLogin').textContent = 'Logout';
}

// menu do administrador
$('btnPerfil').addEventListener('click', async () => {
    if (!usuario) return abrirLogin();
    const perfil = await (await fetch('/api/perfil/' + usuario.id_usuario)).json();

    $('menuFoto').src = '/imagens/perfil/' + usuario.imagem_usuario;
    $('menuNome').textContent = usuario.nome;
    $('menuLikes').textContent = perfil.likes;
    $('menuFilmes').textContent = perfil.filmes;
    $('menu').hidden = false;
});
$('fecharMenu').addEventListener('click', () => $('menu').hidden = true);
$('btnSeusFilmes').addEventListener('click', () => {
    $('menu').hidden = true;
    alternarCadastro(true);
});

// cadastro de filmes
function alternarCadastro(abrir) {
    verMeus = abrir;
    $('cadastro').hidden = !abrir;
    $('areaBusca').hidden = abrir;
    mostrarFilmes();
}
$('btnVoltar').addEventListener('click', () => alternarCadastro(false));

$('capa').addEventListener('change', () => {
    $('nomeArquivo').textContent = $('capa').files[0]?.name || 'Nenhum arquivo escolhido';
});

$('btnCadastrar').addEventListener('click', async () => {
    const titulo = $('titulo').value.trim();
    const genero = $('genero').value.trim();
    const capa = $('capa').files[0];

    const erroCapa = !capa ? 'A capa é obrigatória'
        : !/\.(jpe?g|png|gif|webp)$/i.test(capa.name) ? 'Formatos aceitos: JPG, JPEG, PNG, GIF e WEBP' : '';

    $('erroTitulo').textContent = titulo ? '' : 'O título do filme é obrigatório';
    $('erroGenero').textContent = genero ? '' : 'O gênero é obrigatório';
    $('erroCapa').textContent = erroCapa;
    if (!titulo || !genero || erroCapa) return;

    // FormData é o jeito de enviar arquivo
    const dados = new FormData();
    dados.append('titulo_filme', titulo);
    dados.append('genero', genero);
    dados.append('id_usuario', usuario.id_usuario);
    dados.append('capa', capa);
    await fetch('/api/filmes', { method: 'POST', body: dados });

    ['titulo', 'genero', 'capa'].forEach(id => $(id).value = '');
    $('nomeArquivo').textContent = 'Nenhum arquivo escolhido';
    carregarFilmes();
});

atualizarTela();
carregarFilmes();
setInterval(carregarFilmes, 5000); 