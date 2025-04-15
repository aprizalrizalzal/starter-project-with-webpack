export function generateUnauthenticatedNavList() {
    return `
    <li><a href="#/login">Masuk</a></li>
    <li><a href="#/register">Daftar</a></li>
    `;
}

export function generateAuthenticatedNavList() {
    return `
    <li><a id="logout" href="#/logout">Logout</a></li>
    `;
}