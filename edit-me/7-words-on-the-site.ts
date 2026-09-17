// ============================================================================
// WORDS ON THE SITE
// ============================================================================
// Every heading, menu item, button and small label lives in this one file,
// in the SAME ORDER as your website. Scroll this file the way you scroll
// your site and you'll land on the words you're looking for.
//
// Change the text between the " " marks. Blank ("") falls back to the
// original word, so nothing can end up empty.
// ============================================================================

export const words = {
  // ---- The menu, top-right of every page ----
  menu: {
    highlights: "Selects",
    about: "About",
    gallery: "Gallery",
    videos: "Videos",
    contact: "Contact",
  },

  // ---- Section 1: your best photos ----
  highlights: {
    smallLabel: "SELECTS",
    heading: "Highlights",
  },

  // ---- Section 2: About ----
  // (the "Behind the lens" heading and your story are in 2-about-you.ts)
  about: {
    smallLabel: "ABOUT",
    moreAboutLabel: "MORE ABOUT HIM",
  },

  // ---- The three-column list of what you shoot ----
  serviceIndex: {
    title: "INDEX OF SERVICES",
  },

  // ---- Section 3: the Gallery, with the category tabs ----
  gallery: {
    smallLabel: "GALLERY",
    heading: "Explore Highlights by Category",
    allTabLabel: "All",
  },

  // ==========================================================================
  // YOUR CATEGORY NAMES
  // ==========================================================================
  // Left side = the folder in public/photos/5-gallery -- don't touch it.
  // Right side = what people see. Change that freely.
  //
  // TO ADD a category: make the folder (like "12-maternity") and put photos
  //   in it. It appears on the site by itself, named after the folder. Only
  //   add a line here if you want it to show a different name.
  // TO REMOVE one: delete the photos inside its folder. Empty folder = gone.
  // TO REORDER: change the number at the front of the FOLDER name.
  //
  // A line pointing at a folder that no longer exists is simply ignored.
  // ==========================================================================
  categoryNames: {
    "01-kiddie-parties": "Kiddie Parties",
    "02-debut": "Debut",
    "03-prenup-wedding": "Prenup Wedding",
    "04-sport-events": "Sport Events",
    "05-street": "Street",
    "06-landscape": "Landscape",
    "07-product": "Product",
    "08-corporate-events": "Corporate Events",
    "09-portraits": "Portraits",
    "10-graduation": "Graduation",
    "11-events-coverage": "Client Showcase",
  } as Record<string, string>,

  // ---- Section 4: Videos (currently hidden -- see 4-videos.ts) ----
  videos: {
    smallLabel: "VIDEOS",
    heading: "Work That Moves",
  },

  // ---- Section 5: Contact ----
  // (the big heading and paragraph are in 1-your-details.ts)
  contact: {
    smallLabel: "CONTACT",
    facebookButton: "MESSAGE ON FACEBOOK",
    emailLabel: "EMAIL",
    instagramLabel: "INSTAGRAM",
    phoneLabel: "PHONE",
  },

  // ---- The little grey words dotted around ----
  smallLabels: {
    // The four-box strip under your cover photo.
    based: "BASED",
    shootingSince: "SHOOTING SINCE",
    framesOnFile: "FRAMES ON FILE",
    status: "STATUS",

    // The two lists in About.
    softwareUsed: "SOFTWARE USED",
    gearUsed: "GEAR USED",

    // Beside your round profile picture.
    profileTag: "THE MAN HIMSELF",

    // Bottom corner of the site.
    backToTop: "BACK TO TOP",
  },
};
