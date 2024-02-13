function reporte(texto){
    console.log(texto);
}

// variaveis: 
const formulario_de_endereco = document.querySelector('#address-form');

const cep_in = document.querySelector('#cep');
const rua_in = document.querySelector('#rua');
const numero_in = document.querySelector('#numero');
const complemento_in = document.querySelector('#complemento');
const bairro_in = document.querySelector('#bairro');
const cidade_in = document.querySelector('#cidade');
const estado_in = document.querySelector('#estado');

const entradas = document.querySelectorAll('[data-input]');

const fechar_bt = document.querySelector('#fechar-msg');

const salvar_e_continuar = document.querySelector('#salvo');
const caixa = document.querySelector('#salvar_msg');

// validar entrada digitada no campo cep:
cep_in.addEventListener('keypress',(e)=>{ //tenho acesso ao evento escutado por meio do primeiro argumento, aqui, o "e".
    const somente_numeros = /[0-9]/;
    const tecla = String.fromCharCode(e.keyCode); //"String.fromCharCode" transforma o código da tecla digitada no valor da tecla digitada

    // permitir só números:
    if(!somente_numeros.test(tecla)){
        e.preventDefault(); //cancela o evento 
        return;
    }
});

//evento de pegar o cep digitado:
cep_in.addEventListener('keyup',(e)=>{
    const valor = e.target.value;

    //checa o tamanho da entrada:
    if(valor.length === 8){
        obter_endereco(valor);
    }
});


const obter_endereco = async (cep)=>{
    interruptor_de_carregamento();
    cep_in.blur();

        const api_url = `https://viacep.com.br/ws/${cep}/json`;
        const busca = await fetch(api_url);
        const resposta = await busca.json();

        setTimeout(() => {
            if (resposta.erro === true) {
                if (!rua_in.hasAttribute("disabled")) {
                interruptor_de_edicao();
                }
    
                formulario_de_endereco.reset();
                interruptor_de_carregamento();
                interruptor_de_mensagem("CEP Inválido, tente novamente.");
                return;
            } else {
                if (rua_in.value === "") {
                    interruptor_de_edicao();
                }
    
                    rua_in.value = resposta.logradouro;
                    cidade_in.value = resposta.localidade;
                    bairro_in.value = resposta.bairro;
                    estado_in.value = resposta.uf;
    
                    interruptor_de_carregamento();
                    return;
            }
        }, 1000);
};

// mostra oculta a carregamento
const interruptor_de_carregamento = ()=>{
    const status = document.querySelector('#fade');
    const carregador = document.querySelector('#carregando');

    status.classList.toggle('esconder');
    carregador.classList.toggle('esconder');
};

const interruptor_de_mensagem = (msg)=>{
    const status = document.querySelector('#fade');
    const caixa_da_mensagem = document.querySelector('#mensagem');

    const corpo_da_mensagem = document.querySelector('#mensagem p');

    corpo_da_mensagem.innerHTML = msg;

        status.classList.toggle('esconder');
        caixa_da_mensagem.classList.toggle('esconder');
};

fechar_bt.addEventListener('click',()=> interruptor_de_mensagem());

const interruptor_de_edicao = ()=>{
    if(rua_in.hasAttribute('disabled')){
        entradas.forEach((input)=>{
            input.removeAttribute('disabled');
        });
    } else {
        entradas.forEach((input)=>{
            input.setAttribute('disabled','disabled');
        });
    };
};

formulario_de_endereco.addEventListener('submit',(e)=>{
    e.preventDefault();
    
    interruptor_de_carregamento();
    setTimeout(() => {
        const corpo = document.getElementById('texto_salvo').innerHTML = 'As informações foram salvas com sucesso.<br>Pressione <strong>Continuar</strong> para seguir em frente.';
        salvar_e_continuar.classList.toggle('esconder');
        caixa.classList.toggle('esconder');

            interruptor_de_carregamento();
    }, 1500);
})

const voltar = document.getElementById('voltar').addEventListener('click',()=>{
    salvar_e_continuar.classList.toggle('esconder');
    caixa.classList.toggle('esconder');
});