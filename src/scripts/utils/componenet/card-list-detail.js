export function generateCardListDetail(story) {
    return `
      <img class="story-detail-img" src="${story.photoUrl}" alt="${story.name}" />
      <div class="story-detail-content">
        <h1 class="story-detail-title">${story.name}</h1>
        <p class="story-detail-description">${story.description}</p>
        <div class="story-detail-meta">
          <span>Tanggal: ${new Date(story.createdAt).toLocaleDateString()}</span><br>
          <span>Lokasi: ${story.location.placeName}</span>
        </div>
      </div>
    `;
  }
  