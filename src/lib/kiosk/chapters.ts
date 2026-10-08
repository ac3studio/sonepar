export type Card = {
  example?: string;
  image?: string;
  location?: string;
  logos?: Logo[];
  title: string;
};
export type Chapter = {
  cards: Card[];
  initiallyFlippedCardIndexes?: number[];
  number: string;
  summary: string;
  title: string;
};
export type Logo = { alt: string; src: string };
export const chapters: Chapter[] = [
  {
    cards: [
      {
        example:
          'Since 2024, Sonepar India has been collecting, repairing, and redistributing Rockwell Automation products.',
        logos: [
          {
            alt: 'Rockwell Automation',
            src: '/images/chapter-01/rockwell-logo.png'
          }
        ],
        title: 'Repair and redistribute'
      },
      {
        example:
          'Since 2025, Schneider Electric has offered a refurbished product range, available online through Sonepar.',
        logos: [
          {
            alt: 'Schneider Electric',
            src: '/images/chapter-01/schneider-logo.png'
          }
        ],
        title: 'Offer refurbished products'
      },
      {
        example:
          'Since 2024, Sacchi, a Sonepar Company in Italy, has been repairing a wide range of products and transforming them into reusable resources with the help of local partners.',
        image: '/images/chapter-01/sacchi.jpeg',
        logos: [{ alt: 'Sacchi', src: '/images/chapter-01/sacchi-logo.png' }],
        title: 'Repair for reuse'
      }
    ],
    number: '01',
    summary:
      'Initiatives that extend product life, reuse materials, refurbish products, or create closed-loop circular systems.',
    title: 'Circular economy & Product life extension'
  },
  {
    cards: [
      {
        example:
          'Since 2024, Sonepar France, in partnership with Nexans, has been collecting used cables and recovering valuable raw materials through dedicated recycling solutions.',
        image: '/images/chapter-02/nexans.avif',
        logos: [{ alt: 'Nexans', src: '/images/chapter-02/nexans-logo.webp' }],
        title: 'Recover used cables'
      },
      {
        example:
          'Since 2025, Sonepar Spain and local partners have been operating a smart collection system for small electrical waste.',
        image: '/images/chapter-02/spain.jpg',
        title: 'Collect electrical waste'
      },
      {
        example:
          'Since 2025, Sonepar Brazil, in partnership with ABB, Siemens and Schneider Electric, has been supporting product return and recycling through a structured reverse logistics process.',
        logos: [
          { alt: 'ABB', src: '/images/chapter-02/abb-logo.png' },
          { alt: 'Siemens', src: '/images/chapter-02/siemens-logo.png' },
          {
            alt: 'Schneider Electric',
            src: '/images/chapter-02/schneider-logo.png'
          }
        ],
        title: 'Return and recycle'
      }
    ],
    number: '02',
    summary:
      'Collection, take-back, recycling, and reverse logistics systems for electrical products, cables, and industrial waste.',
    title: 'Reverse logistic'
  },
  {
    cards: [
      {
        example:
          'Since 2023, Sonepar Brazil, in partnership with Prysmian, has been reusing cable drums to reduce virgin wood consumption.',
        image: '/images/chapter-03/prysmian.webp',
        logos: [
          { alt: 'Prysmian', src: '/images/chapter-03/prysmian-logo.webp' }
        ],
        title: 'Reuse cable drums'
      },
      {
        example:
          'Since 2025, Sonepar Sweden and ABB have collaborated on a packaging redesign initiative to reduce waste, optimize transportation, and improve logistics efficiency.',
        image: '/images/chapter-03/abb.webp',
        logos: [{ alt: 'ABB', src: '/images/chapter-03/abb-logo.png' }],
        title: 'Redesign packaging'
      },
      {
        example:
          'Since 2024, Technische Unie, a Sonepar company in the Netherlands, and Eaton have been using data-driven insights to improve transport packaging performance.',
        image: '/images/chapter-03/eaton.webp',
        logos: [
          { alt: 'Eaton', src: '/images/chapter-03/eaton-logo.png' },
          { alt: 'Technische Unie', src: '/images/chapter-03/tu-logo.png' }
        ],
        title: 'Improve transport packaging'
      }
    ],
    initiallyFlippedCardIndexes: [0],
    number: '03',
    summary:
      'Reducing packaging waste, improving transport packaging, and implementing reusable packaging systems.',
    title: 'Sustainable packaging & Waste reduction'
  },
  {
    cards: [
      {
        example:
          'Since 2023, Sonepar Brazil, in partnership with Prysmian, has been reusing cable drums to reduce virgin wood consumption.',
        image: '/images/chapter-04/brazil.webp',
        location: 'Brazil',
        title: 'Reuse cable drums'
      },
      {
        example:
          'Technische Unie, a Sonepar company in the Netherlands, has been improving transport packaging performance through a data-driven optimization initiative.',
        image: '/images/chapter-04/netherlands.webp',
        location: 'The Netherlands',
        title: 'Optimize transport packaging'
      },
      {
        example:
          'Sonepar Spain is accelerating the transition to low-carbon logistics through fleet decarbonization and lower-emission mobility solutions.',
        image: '/images/chapter-04/spain.webp',
        location: 'Spain',
        title: 'Lower-emission mobility'
      }
    ],
    number: '04',
    summary:
      'Sonepar Brazil is advancing sustainable logistics through the deployment of electric vehicles for lower-emission deliveries.',
    title: 'Low-carbon transport & Operations'
  },
  {
    cards: [
      {
        example:
          'Sonepar USA, in partnership with Acuity, donates energy-efficient lighting retrofits to charitable organizations.',
        image: '/images/chapter-05/acuity.webp',
        logos: [{ alt: 'Acuity', src: '/images/chapter-05/acuity-logo.png' }],
        title: 'Lighting for communities'
      },
      {
        example:
          'Sonepar India, in partnership with Prysmian, is supporting greener operations through sustainability-focused solutions and energy management initiatives.',
        logos: [
          { alt: 'Prysmian', src: '/images/chapter-05/prysmian-logo.webp' }
        ],
        title: 'Support greener operations'
      },
      {
        example:
          'Sonepar and Hager are improving the visibility of product carbon and environmental data, giving customers the insights needed to select environmental alternatives.',
        logos: [{ alt: 'Hager', src: '/images/chapter-05/hager-logo.png' }],
        title: 'Make carbon data visible'
      }
    ],
    number: '05',
    summary:
      'Projects that improve energy efficiency or promote sustainable technologies for customers and communities.',
    title: 'Energy efficiency & Sustainable solutions'
  },
  {
    cards: [
      {
        example:
          'Sonepar Brazil promotes sustainability training programs and campaigns in collaboration with suppliers, raising awareness and accelerating ESG adoption across the value chain.',
        image: '/images/chapter-06/brazil.webp',
        title: 'Build sustainability awareness'
      },
      {
        example:
          'In Peru, Sonepar and Signify collaborate on social initiatives by donating lighting solutions to underserved communities, improving safety and quality of life.',
        image: '/images/chapter-06/peru.webp',
        logos: [{ alt: 'Signify', src: '/images/chapter-06/signify-logo.png' }],
        title: 'Light underserved communities'
      }
    ],
    number: '06',
    summary:
      'Initiatives focused on awareness, employee/customer engagement, training, and positive community impact.',
    title: 'Sustainability engagement & Social impact'
  }
];
