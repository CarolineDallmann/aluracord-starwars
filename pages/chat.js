import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useRef } from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'
import Popover from '@mui/material/Popover';
import { getNome } from '../services/getNome'
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker'

const supabase_anon_key =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI4MzcxNywiZXhwIjoxOTU4ODU5NzE3fQ.M0CVmP9Caqfk5A1yJtpNvhcjhTrpm8HowggEFtoz2gc'
const supabase_url = 'https://mqddclipbfhmaqneuyax.supabase.co'
const supabaseClient = createClient(supabase_url, supabase_anon_key)

function escutaMsgTempoReal(adicionaMsg) {
    return supabaseClient
        .from('mensagens')
        .on('INSERT', (respostaLive) => {
            adicionaMsg(respostaLive.new)
        })
        .subscribe()
}

export default function ChatPage() {
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
    const [loading, setLoading] = React.useState(false)
    const [deleting, setDeleting] = React.useState([])

    React.useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                setListaDeMensagens(data)
            });

        const subscription = escutaMsgTempoReal((novaMensagem) => {
            setListaDeMensagens((valorAtualLista) => {
                return [
                    novaMensagem,
                    ...valorAtualLista,
                ]
            });
        });

        return () => {
            subscription.unsubscribe();
        }
    }, []);

    function handleDelete(id) {
        setDeleting((valorAtual) => {
            return [...valorAtual, id]
        })
        supabaseClient
            .from('mensagens')
            .delete()
            .match({ id })
            .then(() => {
                setDeleting((valorAtual) => {
                    return valorAtual.filter((vl) => {
                        return vl !== id
                    })
                })
                setListaDeMensagens(listaDeMensagens.filter((element) => {
                    return element.id !== id
                }))
            })
    }

    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            de: usuarioLogado,
            texto: novaMensagem,
        };

        setLoading(true)

        supabaseClient
            .from('mensagens')
            .insert([
                mensagem
            ])
            .then(({ data }) => {
                setLoading(false)
            })
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
                        onDelete={handleDelete}
                        loading={loading}
                        bloqueados={deleting}
                    />

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
                            placeholder="Insira sua transmissão aqui..."
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

                        <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                console.log('[usando o comp]');
                                handleNovaMensagem(`:sticker: ${sticker}`)
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
                                fontFamily: 'Play'
                            }}
                            onClick={() => {
                                if (mensagem.length >= 1) {
                                    handleNovaMensagem(mensagem)
                                    document.querySelector('textarea').focus()
                                }
                            }}
                        >
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
            <Box
                styleSheet={{
                    width: '100%',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }} >

                <Text variant='heading5' styleSheet={{ fontFamily: 'Play', }}>
                    Chat
                </Text>
                <Button
                    buttonColors={{
                        contrastColor: appConfig.theme.colors.neutrals["000"],
                        mainColor: appConfig.theme.colors.primary[500],
                        mainColorLight: appConfig.theme.colors.primary[400],
                        mainColorStrong: appConfig.theme.colors.primary[600],
                    }}
                    label='Logout'
                    href="/"
                    styleSheet={{
                        fontFamily: 'Play'
                    }}
                />
            </Box>
        </>
    )
}



function MessageList(props) {
    const [usuarioDestacado, setUsuarioDestacado] = React.useState()
    const [nomeUsuario, setNomeUsuario] = React.useState()
    const [openedPopover, setOpenedPopover] = React.useState(false)
    const [popoverAnchor, setPopoverAnchor] = React.useState(null)



    const handlePopoverOpen = (event) => {
        setOpenedPopover(true);
        setPopoverAnchor(event.currentTarget)
    };

    const handlePopoverClose = () => {
        setOpenedPopover(false);
    };

    const popoverEnter = () => { setOpenedPopover(true) }
    const popoverLeave = () => { setOpenedPopover(false) }

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
            {props.loading && <Text
                styleSheet={{
                    fontFamily: 'Play'
                }}
            >
                ✉️ Enviando mensagem ...
            </Text>}

            <Popover
                open={openedPopover}
                BackdropProps={{ sx: { pointerEvents: 'none' } }}
                PaperProps={{
                    sx: { pointerEvents: 'auto' },
                    onMouseEnter: popoverEnter,
                    onMouseLeave: popoverLeave
                }}
                sx={{
                    pointerEvents: 'none',
                    height: 400,
                    width: {
                        xs: 200,
                        sm: 300,
                        md: 400,
                        lg: 500,
                        xl: 500,
                    },
                }}
                anchorEl={popoverAnchor}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <Box
                    styleSheet={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        alignItems: 'center',
                        color: appConfig.theme.colors.neutrals[100],
                        marginBottom: '16px',

                    }}
                >
                    <Image
                        src={`https://github.com/${usuarioDestacado}.png`}
                        styleSheet={{
                            marginBottom: '16px',
                            border: '1px solid',
                        }}
                    />
                    <Box
                        styleSheet={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',

                        }}
                    >
                        <Text
                            styleSheet={{
                                fontFamily: 'Play',
                                color: 'black',
                            }}
                        >
                            {nomeUsuario}
                        </Text>

                        <Button
                            iconName="FaGithub"
                            href={`https://github.com/${usuarioDestacado}`}
                            buttonColors='none'
                            styleSheet={{
                                maxWidth: '20px',
                                maxHeight: '20px',
                                marginLeft: '10px',
                                marginRight: '10px'
                            }}
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}


                        ></Button>

                    </Box>

                </Box>
            </Popover>

            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            fontFamily: 'Play',
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
                                    src={`https://github.com/${mensagem.de}.png`}

                                    onMouseEnter={(event) => {
                                        handlePopoverOpen(event)
                                        setUsuarioDestacado(mensagem.de)
                                        getNome(mensagem.de).then((nome) => {
                                            setNomeUsuario(nome)
                                        })
                                    }}
                                    onMouseLeave={handlePopoverClose}
                                />
                                <Text
                                    tag="strong"
                                    styleSheet={{
                                        fontFamily: 'Play'
                                    }}
                                >
                                    {mensagem.de}
                                </Text>
                                <Text
                                    styleSheet={{
                                        fontSize: '10px',
                                        marginLeft: '8px',
                                        color: appConfig.theme.colors.neutrals[300],
                                        fontFamily: 'Play'
                                    }}
                                    tag="span"
                                >
                                    {(new Date().toLocaleDateString())}
                                </Text>
                            </Box>

                            <Box>
                                <Button
                                    disabled={props.bloqueados.find((id) => {
                                        return id === mensagem.id
                                    })}
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
                                ></Button>
                            </Box>
                        </Box>
                        {mensagem.texto.startsWith(':sticker:') ? (
                            <Image src={mensagem.texto.replace(':sticker:', '')} />
                        ) : (
                            mensagem.texto
                        )}

                    </Text>
                );
            })}

        </Box>
    )
}