export function generateUnauthenticatedNavList() {
    return `
    <li><a href="#/login">Masuk</a></li>
    <li><a href="#/register">Daftar</a></li>
    `;
}

export function generateAuthenticatedNavList() {
    return `
    <li><a href="#/add" id="add" tabindex="0" id="new-story"><i class="fa-solid fa-plus"></i>Add New Story</a></li>
    <li><a href="#/logout" tabindex="0" id="logout">Keluar<i class="fa-duotone fa-solid fa-arrow-right-from-bracket"></i></a></li>
    `;
}