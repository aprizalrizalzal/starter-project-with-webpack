export function generateUnauthenticatedNavList() {
    return `
    <li><a href="#/login">Masuk</a></li>
    <li><a href="#/register">Daftar</a></li>
    `;
}

export function generateAuthenticatedNavList() {
    return `
    <a href="#/add" class="btn" id="new-story">Add New Story</a>
    <li><a href="#/logout" id="logout">Keluar</a></li>
    `;
}