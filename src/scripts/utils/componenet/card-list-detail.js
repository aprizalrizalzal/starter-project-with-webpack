export function generateCardListDetail(story) {
    return `
      <div>
        <img src="${story.photoUrl}" alt="${story.name}" class="detail-img" loading="lazy" />
      </div>
      <hr />
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
  