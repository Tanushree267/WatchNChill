
import WCLogo7 from './WCLogo7.png'
import marvelLogo from './marvelLogo.svg'
import googlePlay from './googlePlay.svg'
import appStore from './appStore.svg'
import screenImage from './screenImage.svg'
import profiles from './profiles.jpg'
import bangalore from './bangalore.jpg'
import hyd1 from'./hyd1.jpg'
import goa2 from'./goa2.jpg'
import mumbai1 from './mumbai1.jpg'
import aboutImage from './aboutImage.jpeg'

export const assets = {
    
    aboutImage,
    WCLogo7,
    marvelLogo,
    googlePlay,
    appStore,
    screenImage,
    profiles,
    bangalore,
    hyd1,
    goa2,
    mumbai1


}

export const dummyTrailers = [
    {
        image: "https://img.youtube.com/vi/WpW36ldAqnM/maxresdefault.jpg",
        videoUrl: 'https://www.youtube.com/watch?v=WpW36ldAqnM'
    },

]

// simple theater data for cities (3 theatres each)
export const theaters = [
  {
    id: 'mumbai',
    city: 'Mumbai',
    image: mumbai1,
    theaters: [
      { name: 'PVR Cinemas - Phoenix Mills', address: 'Lower Parel, Phoenix Mills' },
      { name: 'INOX - Juhu', address: 'Juhu Tara Rd, Juhu' },
      { name: 'Carnival Cinemas - R-City', address: 'Ghatkopar West' },
    ],
  },
  {
    id: 'bengaluru',
    city: 'Bengaluru',
    image: bangalore,
    theaters: [
      { name: 'PVR Orion', address: 'MG Road, Orion Mall' },
      { name: 'INOX - Garuda', address: 'Shivaji Nagar' },
      { name: 'IMAX - Whitefield', address: 'ITPL Road, Whitefield' },
    ],
  },
  {
    id: 'goa',
    city: 'Goa',
    image: goa2,
    theaters: [
      { name: 'Cinemax - Panaji', address: 'Panaji, Near Church' },
      { name: 'Gaiety Cinema', address: 'North Goa' },
      { name: 'PVR - Miramar', address: 'Miramar Beach Area' },
    ],
  },
  {
    id: 'hyderabad',
    city: 'Hyderabad',
    image: hyd1,
    theaters: [
      { name: 'PVR - Inorbit', address: 'Madhapur, Inorbit Mall' },
      { name: 'INOX - Banjara', address: 'Banjara Hills' },
      { name: 'Prasads IMAX', address: 'Hyderabad, Near KPHB' },
    ],
  },
];

export default assets;
