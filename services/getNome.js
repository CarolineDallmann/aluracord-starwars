export async function getNome(user) {
    const response = await fetch(`https://api.github.com/users/${user}`);
    const dados = await response.json()
    if (dados.message) {
        return false
    }
    return dados.name || user
}