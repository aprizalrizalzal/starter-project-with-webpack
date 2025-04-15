export function generateUnauthenticatedNav() {
    return `
    <li><a href="#/login">Masuk</a></li>
    <li><a href="#/register">Daftar</a></li>
    `;
}

export function generateAuthenticatedNav() {
    return `
    <li><a id="logout" href="#/login">Logout</a></li>
    `;
}