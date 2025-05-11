export function generateUnauthenticatedNavList() {
    return `
    <li><a href="#/login">Masuk</a></li>
    <li><a href="#/register">Daftar</a></li>
    `;
}

export function generateAuthenticatedNavList() {
    return `
    <li><button id="subscribe-button" tabindex="0" style="display: none;"><i class="fa-solid fa-bell"></i> Subscribe</button></li>
    <li><button id="unsubscribe-button" tabindex="0" style="display: block;"><i class="fa-solid fa-bell-slash"></i> Unsubscribe</button></li>
    <li><a href="#/add" tabindex="0" id="new-story"><i class="fa-solid fa-plus"></i> Add New Story</a></li>
    <li><a href="#/logout" tabindex="0" id="logout">Keluar <i class="fa-duotone fa-solid fa-arrow-right-from-bracket"></i></a></li>
    `;
}