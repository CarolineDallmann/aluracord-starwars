import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import React from 'react';
import { useRouter } from 'next/router';
import appConfig from '../config.json'
import { getNome } from '../services/getNome'


function Titulo(props) {
    const Tag = props.tag || 'h1';
    return (
        <>
            <><Tag>{props.children}</Tag>
                <style jsx>{` 
        ${Tag} { 
            color: ${appConfig.theme.colors.neutrals['300']};
            font-size: 24px;
            font-weight:600;
        }`}</style></>
        </>
    )
}


export default function PaginaInicial() {
    const [username, setUsername] = React.useState('')
    const [dirty, setDirty] = React.useState(false)
    const [nome, setNome] = React.useState('')
    const [found, setFound] = React.useState(true)
    const roteamento = useRouter();

    function getUrl() {
        if (!found) {
            return 'https://hugocalixto.com.br/wp-content/uploads/sites/22/2020/07/error-404-1.png'
        }
        if (username.length > 2) {
            return `https://github.com/${username}.png`
        }
        return 'https://www.hojeemdia.com.br/polopoly_fs/1.711510.1556898208!/image/image.jpg_gen/derivatives/landscape_653/image.jpg'
    }

    return (
        <>
            <Box
                styleSheet={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: appConfig.theme.colors.neutrals[900],
                    backgroundImage: 'url(https://68.media.tumblr.com/8f637444a51ff813583790301736bbea/tumblr_nzckiqbLw51uf0h9xo1_500.gif)',
                    backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                }}
            >
                <Box
                    styleSheet={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: {
                            xs: 'column',
                            sm: 'row',
                        },
                        width: '100%', maxWidth: '700px',
                        borderRadius: '5px', padding: '32px', margin: '16px',
                        boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                        backgroundColor: appConfig.theme.colors.neutrals[500],
                        opacity: 0.8,
                        border: '1px solid',
                        borderColor: appConfig.theme.colors.primary[500],

                    }}
                >
                    {/* Formulário */}
                    <Box
                        as="form"
                        onSubmit={function (infoEvento) {
                            infoEvento.preventDefault()
                            roteamento.push(`/chat?username=${username}`)
                        }}
                        styleSheet={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
                        }}
                    >
                        <Titulo tag="h2">Seja bem vindo! Eu sei!</Titulo>
                        <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
                            {appConfig.name}
                        </Text>

                        <TextField
                            value={username}
                            placeholder='Digite seu usuário GitHub'
                            onChange={function (event) {
                                console.log('usuario digitou', event.target.value);
                                let valor = event.target.value
                                if (valor.length > 2) {
                                    getNome(valor).then((e) => {
                                        if (e) {
                                            setNome(e)
                                            setFound(true)
                                        } else {
                                            setNome('')
                                            setFound(false)
                                        }
                                    })
                                } else {
                                    setNome('')
                                    setFound(true)
                                }

                                setUsername(valor)
                                setDirty(true)
                            }}
                            fullWidth
                            textFieldColors={{
                                neutral: {
                                    textColor: appConfig.theme.colors.neutrals[200],
                                    mainColor: appConfig.theme.colors.neutrals[900],
                                    mainColorHighlight: appConfig.theme.colors.primary[500],
                                    backgroundColor: appConfig.theme.colors.neutrals[800],
                                },
                            }}
                        />
                        {username.length <= 2 && dirty &&
                            <Text
                                styleSheet={{
                                    marginBottom: '10px', color: appConfig.theme.colors.primary[700],
                                    fontFamily: 'Play',
                                }}
                            >
                                Digite mais que 2 caracteres
                            </Text>}

                        {!found &&
                            <Text
                                styleSheet={{
                                    marginBottom: '10px', color: appConfig.theme.colors.primary[700],
                                    fontFamily: 'Play'
                                }}>
                                Usuário inválido
                            </Text>

                        }

                        <Button
                            disabled={username.length <= 2 || !found}
                            type='submit'
                            label='Entrar a Bordo'
                            fullWidth
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}
                        />
                    </Box>
                    {/* Formulário */}


                    {/* Photo Area */}
                    <Box
                        styleSheet={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            maxWidth: '200px',
                            padding: '16px',
                            backgroundColor: appConfig.theme.colors.neutrals[800],
                            border: '1px solid',
                            borderColor: appConfig.theme.colors.primary[500],
                            borderRadius: '10px',
                            flex: 1,
                            minHeight: '240px',
                        }}
                    >

                        <Image
                            styleSheet={{
                                borderRadius: '50%',
                                marginBottom: '16px',
                                border: '1px solid',
                                borderColor: appConfig.theme.colors.primary[500],
                            }}
                            src={getUrl()}
                        />

                        {found && <Text
                            variant="body4"
                            styleSheet={{
                                color: appConfig.theme.colors.neutrals[200],
                                backgroundColor: appConfig.theme.colors.neutrals[900],
                                padding: '3px 10px',
                                borderRadius: '1000px',
                                textAlign: 'center',
                                fontFamily: 'Play'
                            }}
                        >
                            {nome || 'Chewie'}
                        </Text>}
                    </Box>
                    {/* Photo Area */}
                </Box>
            </Box>
        </>
    );
}