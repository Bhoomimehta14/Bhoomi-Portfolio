# Bhoomi Mehta · Travel journal

My personal portfolio, designed as a scrapbook travel journal. Each place I've worked, studied or built something is a stop on a hand-drawn map, and each stop has its own journal page.

**Live site:** https://bhoomimehta14.github.io/Bhoomi-Portfolio/

## What's inside

| Page | What it covers |
|---|---|
| `index.html` | Cover page, plus the journey map with all four stops |
| `feedmatters.html` | Stop 1: growth and strategy internship at FeedMatters, with my platform-fit scoring model |
| `boston.html` | Stop 2: Ideas to Impact at Boston University |
| `hackathons.html` | Stop 3: first prize at IETE-SF, plus ConnectED, Unisphere and VYBE Learn |
| `designare.html` | Stop 4: head of events and sales team lead for Designare's designathon |
| `about.html` | More context: about me, interests, skills ("what's in my bag") and contact (a postcard) |

## Built with

Plain **HTML, CSS and JavaScript**: no frameworks, libraries or build tools.

- `scrap.css`: the whole design system (paper texture, tape, polaroids, lined notes, postmarks, layouts for desktop and phone)
- `scrap.js`: the moving parts:
  - the pen-drawn airplane that follows the dashed route on the map, and the one that flies across the top of each page as you read
  - sections that slide in as you scroll
  - numbers that count up
  - the "my weights / equal weights" switch on the FeedMatters chart
- The paper texture, stamps, charts and drawings are SVG written directly in the HTML.

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8091
```

Then visit http://localhost:8091.

## Credits

- **Fonts** from [Google Fonts](https://fonts.google.com), all under the SIL Open Font License: DM Serif Display, Newsreader, Caveat and IBM Plex Mono.
- **Photos** are my own, except `photos/feedmatters.jpg`, which is a screenshot of the FeedMatters homepage ([feedmatters.com](https://feedmatters.com)).
- **Data:** the FeedMatters platform-fit scores and weights come from my own analysis for that internship.
- **Design inspiration:** scrapbook and travel-journal layouts I collected on Pinterest and Dribbble. No templates were used.
- **AI assistance:** I used Claude Code (an AI coding assistant) to help write and debug the code, as allowed by the assignment. The ideas, content, writing, photos and design direction are mine.
