import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useRef } from 'react';
import appConfig from '../config.json';

export default function ChatPage() {
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

    function handleNovaMensagem(novaMensagem) {
        const primeiraMsg = listaDeMensagens[0]
        const mensagem = {
            id: primeiraMsg ? primeiraMsg.id + 1 : 1,
            de: 'carolinedallmann',
            texto: novaMensagem,
        };

        setListaDeMensagens([
            mensagem,
            ...listaDeMensagens,
        ]);
        setMensagem('');
    }



    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.neutrals[700],
                backgroundImage: `url(https://thumbs.gfycat.com/TestyFastCockerspaniel.webp)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '80%',
                    maxWidth: '75%',
                    maxHeight: '75vh',
                    padding: '32px',
                    opacity: '0.8',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList
                        mensagens={listaDeMensagens}
                        onDelete={(id) => {
                            setListaDeMensagens(listaDeMensagens.filter((element) => {
                                return element.id !== id
                            }))
                        }} />

                    {/* {listaDeMensagens.map((mensagemAtual) => {
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })} */}
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'flex-start',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    if (mensagem.length >= 1) {
                                        handleNovaMensagem(mensagem);
                                    }
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],

                            }}
                        />
                        <Button
                            type='button'
                            label='Ok'
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}
                            styleSheet={{
                                width: '40px',
                                height: '44px',
                                borderRadius: '10px 5px 10px 5px',
                                backgroundColor: appConfig.theme.colors.primary[500],
                            }}
                            onClick={() => {
                                if (mensagem.length >= 1) {
                                    handleNovaMensagem(mensagem)
                                    document.querySelector('textarea').focus()
                                }
                            }}
                        >
                            OK
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5' styleSheet={{ fontFamily: 'Play', }}>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"

                />
            </Box>
        </>
    )
}



function MessageList(props) {
    console.log(props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',


            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}

                    >
                        <Box
                            styleSheet={{
                                marginBottom: '2px',
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',

                            }}
                        >
                            <Box>
                                <Image
                                    styleSheet={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        display: 'inline-block',
                                        marginRight: '8px',
                                    }}
                                    src={`https://github.com/carolinedallmann.png`}
                                />
                                <Text tag="strong">
                                    {mensagem.de}
                                </Text>
                                <Text
                                    styleSheet={{
                                        fontSize: '10px',
                                        marginLeft: '8px',
                                        color: appConfig.theme.colors.neutrals[300],
                                    }}
                                    tag="span"
                                >
                                    {(new Date().toLocaleDateString())}
                                </Text>
                            </Box>

                            <Box>
                                <Button
                                    type='button'
                                    label='X'
                                    styleSheet={{
                                        width: '30px',
                                        height: '33px',
                                        borderRadius: '10px 5px 10px 5px',
                                        backgroundColor: appConfig.theme.colors.primary[500],


                                    }}
                                    buttonColors={{
                                        contrastColor: appConfig.theme.colors.neutrals["000"],
                                        mainColor: appConfig.theme.colors.primary[500],
                                        mainColorLight: appConfig.theme.colors.primary[400],
                                        mainColorStrong: appConfig.theme.colors.primary[600],

                                    }}
                                    onClick={() => {
                                        props.onDelete(mensagem.id)

                                    }}
                                >X</Button>
                            </Box>
                        </Box>
                        {mensagem.texto}
                    </Text>
                );
            })}
        </Box>
    )
}