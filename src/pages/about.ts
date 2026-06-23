import { footerTemplate, navTemplate } from "../components/layout";
import { travelPlaces, type TravelPlace } from "../data/travel";

const favoriteMovies = [
  { title: "Chef", poster: "/MoviePoster-Chef.jpg" },
  { title: "The Batman", poster: "/MoviePoster-TheBatman.jpg" },
  { title: "When Harry Met Sally", poster: "/MoviePoster-WhenHarryMetSally.jpg" },
];

export function renderAbout(): string {
  return `
    ${navTemplate("/")}
    <main class="about-page">
      <section class="about-hero">
        <div class="about-hero-copy">
          <p class="eyebrow">Microsoft Engineer | AI-assisted builder</p>
          <h1>Hi, I am Will Augustine.</h1>
          <p>
            I like building useful web things, solving messy problems, and working with people who care about making software better. When I am not coding, I am probably planning a trip, watching a movie, or hanging out with Milo and Otis.
          </p>
          <div class="hero-actions">
            <a class="action-button primary" href="/resume" data-route>View Resume</a>
            <a class="action-button secondary" href="mailto:willaugustine64@outlook.com">Email Me</a>
            <a class="action-button secondary" href="/projects" data-route>Current Projects</a>
            <a class="action-button secondary" href="/technologies" data-route>How I Made This Website</a>
            <a class="action-button secondary" href="/help" data-route>Help & Contact</a>
          </div>
        </div>
        <figure class="about-hero-photo">
          <img src="/about-will-venice.jpg" alt="Will Augustine in Venice, Italy" />
        </figure>
      </section>

      <section class="travel-section">
        <div class="travel-copy">
          <p class="eyebrow">Travel</p>
          <h2>I love seeing new places.</h2>
          <p>
            Travel is one of the ways I reset and stay curious. I grew up in Washington, went to college in Montana, now live in Philadelphia, and I keep adding new places to the map.
          </p>
        </div>
        <div class="flat-map">
          <div class="map-canvas" aria-label="Map of places Will has lived or visited">
            <img class="world-outline-map" src="/world-outline.svg" alt="World map outline" />
            ${travelPlaces.map(travelPinTemplate).join("")}
          </div>
        </div>
      </section>

      <section class="about-personal-section">
        <div class="section-heading">
          <p class="eyebrow">Outside The Code</p>
          <h2>A little more about me.</h2>
        </div>
        <div class="grid personal-grid">
          <article class="panel personal-story dogs-story">
            <figure class="personal-photo">
              <img src="/about-milo-otis.jpg" alt="Will Augustine with Amelia and their dogs Milo and Otis" loading="lazy" />
            </figure>
            <div class="personal-copy">
              <p class="eyebrow">My Family</p>
              <h3>The best part of every day.</h3>
              <p>
                Milo and Otis are a huge part of my life. Milo is a golden retriever with endless joy, and Otis is a border collie mix with a big personality and even bigger opinions. They make every day better, funnier, and a lot more lively. My amazing wife Amelia loves exploring the world with me and is the best travel buddy I could ask for. We are always planning our next trip or adventure together.
              </p>
              <div class="dog-facts" aria-label="Dog details">
                <span><strong>Milo</strong> Golden retriever</span>
                <span><strong>Otis</strong> Border collie mix</span>
                <span><strong>Amelia</strong> The best</span>
              </div>
            </div>
          </article>

          <article class="panel personal-story movie-story">
            <div class="personal-copy">
              <p class="eyebrow">Movies</p>
              <h3>I love movies and keeping track of what I watch.</h3>
              <p>
                Movies are one of my favorite ways to unwind and find new stories to think about. I have a Letterboxd account for logging watches, ratings, and giving some first thoughts after finishing a movie.
              </p>
              <a class="action-button secondary" href="https://letterboxd.com/FoodieFrank/" target="_blank" rel="noreferrer">View My Letterboxd Profile</a>
            </div>
            <div class="grid movie-poster-grid" aria-label="Favorite movies">
              ${favoriteMovies.map(favoriteMovieTemplate).join("")}
            </div>
          </article>
        </div>
      </section>

    </main>
    ${footerTemplate()}
  `;
}

function travelPinTemplate(place: TravelPlace): string {
  const tooltip = place.note ? `<strong>${place.label}</strong><span>${place.note}</span>` : `<strong>${place.label}</strong>`;
  const ariaLabel = place.note ? `${place.label}: ${place.note}` : place.label;

  return `
    <button class="travel-pin" type="button" style="left: ${place.x}%; top: ${place.y}%;" aria-label="${ariaLabel}">
      <span class="pin-dot"></span>
      <span class="pin-tooltip">${tooltip}</span>
    </button>
  `;
}

function favoriteMovieTemplate(movie: { title: string; poster: string }): string {
  return `
    <figure class="movie-poster-card">
      <img src="${movie.poster}" alt="${movie.title} movie poster" loading="lazy" />
      <figcaption>${movie.title}</figcaption>
    </figure>
  `;
}
