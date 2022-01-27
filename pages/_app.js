function GlobalStyle() {
    return (
        <style global jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Play&display=swap');
        * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
      }
      body {
        font-family: 'Play', sans-serif 
      }
      ::-webkit-scrollbar {
        width: 10px; 
      }
      ::-webkit-scrollbar-track {
        background: #212931; 
        border-radius: 5px;
      }
      ::-webkit-scrollbar-thumb {
        background: #181F25; 
        border-radius: 5px;
      }
      /* App fit Height */ 
      html, body, #__next {
        min-height: 100vh;
        display: flex;
        flex: 1;
      }
      #__next {
        flex: 1;
      }
      #__next > * {
        flex: 1;
      }
      /* ./App fit Height */ 
        `}</style>
    )
}

export default function MyApp({ Component, pageProps }) {
    return (
        <>
        <GlobalStyle/>
        <Component {...pageProps} />
        </>
    )
    
  }