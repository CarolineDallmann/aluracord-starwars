export async function getStaticProps(context) {
    const res = await fetch(`https://api.github.com/users/carolinedallmann`)
    const data = await res.json()
  
    if (!data) {
      return {
        notFound: true,
      }
    }
  

  }