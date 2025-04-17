export function generateUnauthenticatedNavList() {
    return `
    <li><a href="#/login">Masuk</a></li>
    <li><a href="#/register">Daftar</a></li>
    `;
}

export function generateAuthenticatedNavList() {
    return `
    <button class="btn" id="new-story">Add New Story</button>
    <li><a id="logout" href="#/logout">Keluar</a></li>
    `;
}