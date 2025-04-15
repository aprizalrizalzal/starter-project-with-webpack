export function generateCardList(story) {
    return `
      <div class="card" id="card-${story.id}">
        <img class="card-img" src="${story.photoUrl}" alt="${story.name}" />
        <div class="card-body">
          <h3 class="card-title">${story.name}</h3>
          <p class="card-description">${story.description}</p>
          <div class="card-meta">
            <small>${new Date(story.createdAt).toLocaleDateString()}</small><br>
            <small>${story.lat}, ${story.lon}</small>
          </div>
        </div>
      </div>
    `;
  }
  