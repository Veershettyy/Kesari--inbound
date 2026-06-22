/**
 * Seeds all 65 packages from frontend data.js into MongoDB.
 * Also loads pre-translated names from the locale files.
 * Run: node scripts/seedPackages.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Package  = require('../models/Package');

// All packages data (copied from src/data/packages.js)
const PACKAGES = [
  {name:"Wildlife of India",days:11,nights:10,theme:"Nature",tags:"Adventure,Family,Wildlife",code:"FIT-INBOUND-01",places:"Delhi → Bandhavgarh → Kanha → Pench → Tadoba → Mumbai",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/sIPGp1iNY2ej8ZuA0wHyFJYZ8XgTzEV6rlfEhjoQ.jpg"},
  {name:"Caves of Maharashtra",days:6,nights:5,theme:"Historic",tags:"Family,Luxury",code:"FIT-INBOUND-02",places:"Nashik → Aurangabad (Ajanta & Ellora)",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/aRXfSmaV32L9cl7m7zOEQgPjcRyktXfQ9sN14Yc8.jpg"},
  {name:"Tribal Tour of India",days:7,nights:6,theme:"First Timers",tags:"Honeymoon,Luxury",code:"FIT-INBOUND-03",places:"Bhubaneshwar → Gopalpur → Raygada → Jeypore",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/knfGe2PPkYMzcoXDXKBXrjdAfsDbz37adSaCUueK.jpg"},
  {name:"Carnoustie Ayurveda & Wellness",days:8,nights:7,theme:"Ayurveda and Wellness",tags:"Wellness Spa",code:"FIT-INBOUND-04",places:"Kerala",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/fdrp2Wb4Fdm1r4Y3y7wUUyynNWelLK5FdMNq4RHB.jpg"},
  {name:"Best of Nepal",days:8,nights:7,theme:"First Timers",tags:"Luxury",code:"FIT-INBOUND-06",places:"Kathmandu → Chitwan → Pokhra → Kathmandu",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/S55WMddZe7zcAxzJNJeGdoIB6YgmPkBLeJtSQd2W.jpg"},
  {name:"Best of Nepal – Luxury",days:8,nights:7,theme:"Luxury",tags:"Luxury",code:"FIT-INBOUND-11",places:"Kathmandu → Chitwan → Pokhra → Kathmandu",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/nk1Ml7nhIjpPqKKYxWSnNUbkNhvuoAJjR5viz93X.jpg"},
  {name:"Best of Sri Lanka",days:7,nights:6,theme:"Luxury",tags:"Luxury",code:"FIT-INBOUND-12",places:"Kandy → Nuwara Eliya → Bentota",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/FaZSyxIyu9NojSfcSJkridg6E5Ls0Qv8xpiDVsMv.jpg"},
  {name:"Heart of India – Madhya Pradesh",days:7,nights:6,theme:"Luxury",tags:"Luxury",code:"FIT-INBOUND-13",places:"Gwalior → Khajuraho → Panna → Jabalpur",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/UHOPHwL5Iclkw5pvyC1zD7OTeONmfFe2ngj9HkFI.jpg"},
  {name:"North East India",days:10,nights:9,theme:"Luxury",tags:"Luxury",code:"FIT-INBOUND-14",places:"Manas → Shillong → Cherrapunjee → Kaziranga",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/F1U45bPY423hkyCYPJEa8numyj2xQtZUafBzswwp.jpg"},
  {name:"Glimpses of Uttar Pradesh",days:6,nights:5,theme:"Luxury",tags:"Luxury",code:"FIT-INBOUND-15",places:"Varanasi → Prayagraj → Ayodhya → Lucknow",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/7iuV5ZInZUpz07PoGNthwsAeHWi63DqdMsYEbpRW.jpg"},
  {name:"Best of Bhutan",days:8,nights:7,theme:"Luxury",tags:"Luxury",code:"FIT-INBOUND-16",places:"Phuentsholing → Thimphu → Punakha → Paro",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/azzfITPvBlSLXzWEQijbIjvC1cmihiJByxhmGQN4.jpg"},
  {name:"Ayurvedic Panchakarma with Dharana",days:15,nights:14,theme:"Ayurveda and Wellness",tags:"Luxury",code:"FIT-INBOUND-17",places:"Lonavala",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/TCB0a98TyzDUmRQKdTMZfawn8PQvDV2wE9qeB8xg.jpg"},
  {name:"Taste of Kerala with CGH Earth Hotels",days:11,nights:10,theme:"Luxury",tags:"Luxury",code:"FIT-INBOUND-7",places:"Cochin → Kumarakom → Thekkady → Chetinad → Pondicherry",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/w9zhH51F0skNcdyrZIGm7AAhCQh4yVpC4B74qkUS.jpg"},
  {name:"Kerala with CGH Earth Hotels",days:8,nights:7,theme:"First Timers",tags:"Luxury",code:"FIT-INBOUND-8",places:"Cochin → Thekkady → Kumarakom → Marari",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/r2H2WKybmYhgDseksFdswV1TwbYF95Tpb7gsmt5b.jpg"},
  {name:"Essence of Maharashtra",days:9,nights:8,theme:"First Timers",tags:"Weekend Break",code:"INBOUND-01",places:"Mumbai → Pune → Aurangabad → Nashik → Mumbai",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/5ODUJ5cTSwqrbYfNuMsXfSGbo6EhwLSGRwIQ0dfu.jpg"},
  {name:"Southern Odyssey",days:11,nights:10,theme:"First Timers",tags:"Weekend Break",code:"INBOUND-010",places:"Chennai → Mahabalipuram → Pondicherry → Thanjavur → Madurai → Kerala",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/bCcO8NST0lDMUgKk17eDCCoCeN41nc0Z822VSgSa.jpg"},
  {name:"Wildlife Safaris",days:9,nights:8,theme:"Nature",tags:"Weekend Break",code:"INBOUND-011",places:"Delhi → Kanha → Bandhavgarh → Khajuraho → Agra",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/10ELuGW7C0qKP4qaDTJYXjdZlyisiaK6wVS0cB70.jpg"},
  {name:"Wild Retreat",days:15,nights:14,theme:"Nature",tags:"Weekend Break",code:"INBOUND-012",places:"Delhi → Jaipur → Ranthambore → Agra → Bandhavgarh → Kanha → Mumbai",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/E52t1Zbt1eTnFCBBu7MpXQcxUw4kZh2NoV6JE25K.jpg"},
  {name:"Panoramic Leh Ladakh",days:6,nights:5,theme:"Nature",tags:"Weekend Break",code:"INBOUND-013",places:"Leh → Nubra → Pangong → Leh",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/FiSyzN84Tj4KsNL4aq18Ves7nY7npfmYKwxeJFQT.jpg"},
  {name:"Engaging Leh & Ladakh",days:10,nights:9,theme:"Adventure",tags:"Weekend Break",code:"INBOUND-014",places:"Leh → Nubra → Pangong → Tso Moriri → Lamayuru",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/PKyNS4nQ9N3UoPtRSlkL009pn7INiIhrgXrgyc5F.jpg"},
  {name:"Gateway to North East",days:10,nights:9,theme:"Nature",tags:"Weekend Break",code:"INBOUND-015",places:"Guwahati → Kaziranga → Shillong → Tawang → Dirang",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/ac048kOgbFJsDFUjz74JgNNTxIav2IIgUsLF7AMz.jpg"},
  {name:"North East India Tour",days:12,nights:11,theme:"First Timers",tags:"Weekend Break",code:"INBOUND-016",places:"Gangtok → Lachen → Lachung → Pelling → Shillong → Kaziranga",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/i1L6Gg8KfkWPoaVTzFo5Bgt51utvN7Fbi30ZNAOx.jpg"},
  {name:"Journey of Indian Royals",days:16,nights:15,theme:"Historic",tags:"Weekend Break",code:"INBOUND-02",places:"Delhi → Udaipur → Jaipur → Agra → Orchha → Khajuraho → Varanasi → Kathmandu",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/DAHsHupFduXUvSwreHEvubgvB9PAxjSSP80nCSAz.jpg"},
  {name:"Heritage Trail",days:15,nights:14,theme:"Historic",tags:"Weekend Break",code:"INBOUND-03",places:"Delhi → Gwalior → Khajuraho → Orchha → Bhopal → Mandu → Aurangabad → Mumbai",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/q5vg9a5szTzVWDuoIMxBjvgFCUCCjVQnDrwekZmV.jpg"},
  {name:"Glorious Forts of Rajasthan",days:13,nights:12,theme:"Historic",tags:"Family",code:"INBOUND-05",places:"Delhi → Neemrana → Jaipur → Gajner → Jaisalmer → Luni → Rohet → Devigarh",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/vqZXiD4zAluKZvRRd4dBRx68WGuiwvS5s2D2qhcP.jpg"},
  {name:"Glorious Gujarat",days:14,nights:13,theme:"First Timers",tags:"Weekend Break",code:"INBOUND-06",places:"Ahmedabad → Bhavnagar → Diu → Sasangir → Gondal → Bhuj → Ahmedabad",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/ZpokjmeyQvy3Tmq8jYe2NQZgfCJSa1FOWpGvFyXB.jpg"},
  {name:"Royal Odyssey",days:14,nights:13,theme:"Historic",tags:"Weekend Break",code:"INBOUND-07",places:"Delhi → Mandawa → Bikaner → Jaisalmer → Jodhpur → Udaipur → Jaipur",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/UyVxNzKRGcUKhzXhxuamNjqrUYqPy69Q7zTWP3B4.jpg"},
  {name:"Serene Kerala",days:11,nights:10,theme:"Nature",tags:"Weekend Break",code:"Inbound-09",places:"Cochin → Munnar → Thekkady → Kumarakom → Alleppey → Kovalam",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/EyKrYEgJjUYlvYe2FUf54POOrODXuKo4fiSw7V6K.jpg"},
  {name:"Ayurveda and Spa",days:12,nights:11,theme:"Ayurveda and Wellness",tags:"Weekend Break",code:"INBOUND-12",places:"Kochi → Kumarakom → Alleppey → Kovalam",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/e8OvevXBqP8B1jp9U33Vs8RpsDNZGxyImgbx48lW.jpg"},
  {name:"Southern Sojourn",days:10,nights:9,theme:"First Timers",tags:"Weekend Break",code:"INBOUND-13",places:"Mumbai → Hampi → Nagarhole → Ooty → Coonoor → Cochin",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/xePnnUBdNjhFbzANLqjvRJC1H1gRjcEL1m7QFn8g.jpg"},
  {name:"The Grand India",days:19,nights:18,theme:"First Timers",tags:"Weekend Break",code:"INBOUND-14",places:"Delhi → Agra → Jaipur → Jodhpur → Udaipur → Mumbai → Aurangabad → Goa → Cochin",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/kzVYJqq0BEVJRqGMX2NrZ9kXbZcv3q9WU5Bx0UWc.jpg"},
  {name:"Serenity of the Hills",days:9,nights:8,theme:"Nature",tags:"Weekend Break",code:"INBOUND-15",places:"Kolkata → Darjeeling → Sikkim → Kalimpong",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/mwFmMfnPuCRuTdN9gVHBysTwvjL8B4IpM2gOcpXQ.jpg"},
  {name:"Soulful India",days:9,nights:8,theme:"Spiritual",tags:"Weekend Break",code:"INBOUND-16",places:"Varanasi → Bodhgaya → Rajgir → Nalanda → Patna",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/3BTwbh1gp3PcJkJnFJjWyH1BQAIG2MfQ7bxjLKv9.jpg"},
  {name:"Spiritual India",days:11,nights:10,theme:"Spiritual",tags:"Weekend Break",code:"INBOUND-17",places:"Delhi → Haridwar → Rishikesh → Nainital → Agra → Varanasi",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/3wWf0EM7tT1y8hRHK5VdD6xnTmpyIZZMrh7O3WZW.jpg"},
  {name:"Scintillating South India",days:11,nights:10,theme:"First Timers",tags:"Weekend Break",code:"INBOUND-18",places:"Kochi → Munnar → Thekkady → Mysore → Udupi → Goa",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/x6xhbcJi7fmpC8ItM9a0WcLH9JMKHoI9uKl5P7hv.jpg"},
  {name:"Shades of Rajasthan",days:10,nights:9,theme:"Historic",tags:"Weekend Break",code:"INBOUND-19",places:"Delhi → Jaipur → Jodhpur → Jaisalmer → Bikaner → Agra",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/YxFD2wawSjQ5Gkb6aFG9VHXV6bVkj71e0LIa3YPy.jpg"},
  {name:"Hidden Gems of India",days:12,nights:11,theme:"Historic",tags:"Weekend Break",code:"INBOUND-20",places:"Mumbai → Aurangabad → Nashik → Hampi → Badami → Aihole",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/VDwdWKYpUn9jPqF9v5bG5QXhSHXhz8LVnA8meFnP.jpg"},
  {name:"Gems of South",days:12,nights:11,theme:"First Timers",tags:"Weekend Break",code:"INBOUND-21",places:"Hyderabad → Hampi → Mysore → Ooty → Madurai → Rameswaram",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/TP6sSd7yXXSumf8sW2CjxlWnpSFdTPb0EUEpkagJ.jpg"},
  {name:"The Heritage of Madhya Pradesh",days:11,nights:10,theme:"Historic",tags:"Weekend Break",code:"INBOUND-22",places:"Mumbai → Aurangabad → Khajuraho → Varanasi → Agra → Delhi",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/p4bBV4jMfbNOYfmLZoVAWlGYCeGON49dAbcHJZ6M.jpg"},
  {name:"The Luxury train Journey",days:8,nights:7,theme:"Luxury Train",tags:"Weekend Break",code:"INBOUND-23",places:"Delhi → Jaipur → Sawai Madhopur → Chittorgarh → Udaipur → Jodphur → Bharatpur → Agra",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/nGvvjWi4oc8tkZyiRWz5xg1BxdAH6RJbfT5f4SoC.jpg"},
  {name:"Palace on Wheels",days:8,nights:7,theme:"Luxury Train",tags:"Weekend Break",code:"INBOUND-24",places:"Delhi → Jaipur → Sawai Madhopur → Chittorgarh → Udaipur → Jodphur → Bharatpur → Agra",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/NNkbBg5GZoihlN5mWF2P2bvjRqtXi7f3UoKw0VAF.jpg"},
  {name:"Maharajas' Express",days:8,nights:7,theme:"Luxury Train",tags:"Weekend Break",code:"INBOUND-25",places:"Mumbai → Udaipur → Jodhpur → Bikaner → Jaipur → Ranthambore → Agra → Delhi",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/y8lDtHT7pKT3WoQ1vGc5lrFHF1QjBVQbM3axFzaR.jpg"},
  {name:"Deccan Odyssey",days:8,nights:7,theme:"Luxury Train",tags:"Weekend Break",code:"INBOUND-26",places:"Mumbai → Pune → Nashik → Aurangabad → Ajanta → Tadoba → Nagpur",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/fGvQRiDsR0W1SIpSl6YzXFWpFR0dUkk0vfBYwnTT.jpg"},
  {name:"Golden Chariot",days:8,nights:7,theme:"Luxury Train",tags:"Weekend Break",code:"INBOUND-27",places:"Bengaluru → Mysore → Kabini → Hampi → Badami → Goa",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/5MOlDxFUGMiJPyBM8JuaEPi1Wb0yBKinVpW6KVzx.jpg"},
  {name:"The Buddhist Trail",days:10,nights:9,theme:"Spiritual",tags:"Weekend Break",code:"INBOUND-28",places:"Delhi → Varanasi → Bodhgaya → Nalanda → Rajgir → Kushinagar → Lumbini → Sravasti → Lucknow",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/N9nXD7jnE94iFfgR5tPg8SnCeI7jkuXjYHYdpnNn.jpg"},
  {name:"Char Dham Yatra",days:14,nights:13,theme:"Spiritual",tags:"Weekend Break",code:"INBOUND-29",places:"Delhi → Haridwar → Rishikesh → Yamunotri → Gangotri → Kedarnath → Badrinath → Rishikesh",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/wPd7kOPzKHaPhVE8BtHnuQh9mGYeGOxBRKNn4I9s.jpg"},
  {name:"Exotic Kerala Backwaters",days:7,nights:6,theme:"Nature",tags:"Weekend Break",code:"INBOUND-30",places:"Kochi → Alleppey → Kumarakom → Thekkady → Munnar → Kochi",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/rLBuWXeHpGvnGKH3iEizHJE1v0PLKL5NfGLTlgRz.jpg"},
  {name:"Luxury Kerala",days:8,nights:7,theme:"Luxury",tags:"Weekend Break",code:"INBOUND-31",places:"Kochi → Munnar → Thekkady → Alleppey → Kovalam",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/wZO8jKg4ZLH7RnMlF9bPt9nHLZ0rjXIlvI3Ml50b.jpg"},
  {name:"Classic Rajasthan",days:12,nights:11,theme:"Historic",tags:"Weekend Break",code:"INBOUND-32",places:"Delhi → Agra → Jaipur → Pushkar → Jodhpur → Jaisalmer → Bikaner",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/6bTy7vj8M1UvHvLmT5vXEFujIIqmAiR5l62bsqzJ.jpg"},
  {name:"Golden Triangle",days:6,nights:5,theme:"First Timers",tags:"Weekend Break",code:"INBOUND-33",places:"Delhi → Agra → Jaipur → Delhi",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/VPvjkCYEKOq2e7LwmFB0vXJiQ3V9nRJMy5Gw64JA.jpg"},
  {name:"Golden Triangle with Varanasi",days:8,nights:7,theme:"First Timers",tags:"Weekend Break",code:"INBOUND-34",places:"Delhi → Agra → Jaipur → Varanasi",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/gJj4BvSFhLxpMDV2l8cXqFh3LKYKzX5MMYX7BhEC.jpg"},
  {name:"Golden Triangle with Ranthambore",days:7,nights:6,theme:"First Timers",tags:"Weekend Break",code:"INBOUND-35",places:"Delhi → Agra → Ranthambore → Jaipur → Delhi",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/UKJXqg1w9E9LD7NQxHMZQHEOIMt5v1xt1GqXNiLI.jpg"},
  {name:"Golden Triangle with Mumbai",days:9,nights:8,theme:"First Timers",tags:"Weekend Break",code:"INBOUND-36",places:"Delhi → Agra → Jaipur → Mumbai",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/TbGe5YLqJf1v2MsRwLHbpnT2nKEU3H0kBuLq1LoF.jpg"},
  {name:"Golden Triangle with Goa",days:9,nights:8,theme:"First Timers",tags:"Weekend Break",code:"INBOUND-37",places:"Delhi → Agra → Jaipur → Goa",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/CU79qTJlsczTz2WrZjAk0jRIiRG24Ynf4kOLj6Z0.jpg"},
  {name:"Colorful India",days:15,nights:14,theme:"First Timers",tags:"Weekend Break",code:"INBOUND-38",places:"Mumbai → Aurangabad → Hampi → Goa → Kochi → Periyar → Alleppey → Mysore → Chennai",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/T4lNYIQD3hHJE5Yz9d9GFPo8a3lVc1c3gV7m0wqh.jpg"},
  {name:"Best of Goa",days:5,nights:4,theme:"First Timers",tags:"Weekend Break",code:"INBOUND-39",places:"Goa",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/BmHrV4oQdCbhxluisDmJ5qWrLqzxfaCBCUv3YwnN.jpg"},
  {name:"Enchanting Himachal",days:9,nights:8,theme:"Nature",tags:"Weekend Break",code:"INBOUND-40",places:"Delhi → Shimla → Manali → Dharamshala → Amritsar",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/YNovFDRDN6n6nfEIQ4nSRRgE2gHqYqIf8jbAovH5.jpg"},
  {name:"The Andaman Islands",days:6,nights:5,theme:"Nature",tags:"Weekend Break",code:"INBOUND-41",places:"Port Blair → Havelock → Neil Island",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/P0c8FsVDGH9s9A5Wn5SLl4mVZ9ELvROjP5aBdE2T.jpg"},
  {name:"Best of Himachal",days:10,nights:9,theme:"Nature",tags:"Weekend Break",code:"INBOUND-42",places:"Delhi → Shimla → Manali → Rohtang → Kullu → Dharamshala → Amritsar",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/4Ls4lfTiV9fNS08Kre5wAnLHJiP1G7JqPJCKcOBr.jpg"},
  {name:"Magical Meghalaya",days:6,nights:5,theme:"Nature",tags:"Weekend Break",code:"INBOUND-43",places:"Guwahati → Shillong → Cherrapunjee → Mawlynnong",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/DfwfEsGiVE9Jwd8YtpKlI5nvnMXOPzjkjCVrEa3n.jpg"},
  {name:"Wonderful Kolkata & Sunderbans",days:6,nights:5,theme:"Nature",tags:"Weekend Break",code:"INBOUND-44",places:"Kolkata → Sunderbans → Kolkata",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/G6E0A7pAPiXagUcFJGxCc6mvjFuGivAU4XjIWBTK.jpg"},
  {name:"Timeless Varanasi",days:4,nights:3,theme:"Spiritual",tags:"Weekend Break",code:"INBOUND-45",places:"Varanasi → Sarnath",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/JmP5YfqdLv1p5hm45Hna3Y0DnC68D8z6a7FbhvNP.jpg"},
  {name:"Colours of Holi in Rajasthan",days:5,nights:4,theme:"Historic",tags:"Family,Festivals",code:"INBOUND-46",places:"Delhi → Jaipur → Agra",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/1xMGmzJSriTpBxJgEyNWJZc8lgzw1z4K5yyeUB83.jpg"},
  {name:"Pushkar Camel Fair",days:5,nights:4,theme:"Historic",tags:"Family,Festivals",code:"INBOUND-47",places:"Delhi → Jaipur → Pushkar → Agra",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/yrNHaqKlJGTfCZiWHv09x5xVQ3bq9ULGrI5aBJBw.jpg"},
  {name:"Hornbill Festival",days:6,nights:5,theme:"Historic",tags:"Family,Festivals",code:"INBOUND-48",places:"Dimapur → Kohima → Dimapur",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/Y3wvf5BhLbTWsVCl6fUMKqHrQ8nnKvLpVuJ1xdHK.jpg"},
  {name:"Bikaner Camel Festival",days:4,nights:3,theme:"Historic",tags:"Family,Festivals",code:"INBOUND-49",places:"Delhi → Bikaner → Delhi",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/JvniE0c8JEuYKo0tT1AvmL7sLTbJ64vEMZPRGi5N.jpg"},
  {name:"Jaisalmer Desert Festival",days:5,nights:4,theme:"Historic",tags:"Family,Festivals",code:"INBOUND-50",places:"Delhi → Jaisalmer → Delhi",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/EkWWG7D4pXc7V43t0TdBOTMYKjqy7UPKxmROxLfp.jpg"},
  {name:"Rann of Kutch",days:5,nights:4,theme:"Nature",tags:"Family,Festivals",code:"INBOUND-51",places:"Ahmedabad → Bhuj → Dasada → Ahmedabad",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/KaHFlhS3Xl8V7ck8qYf9LdYYRp0hqBidWzPy4S4e.jpg"},
  {name:"Onam Celebration in Kerala",days:6,nights:5,theme:"Nature",tags:"Family,Festivals",code:"INBOUND-52",places:"Kochi → Thrissur → Palakkad → Munnar",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/EiVNQvAe5wlQwOXFnNBKrQ08mzrb5Z8wr4Jv5k1N.jpg"},
  {name:"Yoga and Meditation Retreat",days:7,nights:6,theme:"Ayurveda and Wellness",tags:"Wellness,Spiritual",code:"INBOUND-53",places:"Rishikesh",img:"https://kesariselect.s3.ap-south-1.amazonaws.com/B1R2S2F3S4A5Q6Z7N8P9X0Y1W2V3U4T5S6R7Q8P9.jpg"},
];

// Load pre-translated names from en locale
const enTours = require('../../src/locales/en/tours.json');
const esTours = require('../../src/locales/es/tours.json');
const frTours = require('../../src/locales/fr/tours.json');
const hiTours = require('../../src/locales/hi/tours.json');
const deTours = require('../../src/locales/de/tours.json');
const jaTours = require('../../src/locales/ja/tours.json');
const ptTours = require('../../src/locales/pt/tours.json');
const itTours = require('../../src/locales/it/tours.json');
const zhTours = require('../../src/locales/zh/tours.json');
const arTours = require('../../src/locales/ar/tours.json');
const koTours = require('../../src/locales/ko/tours.json');
const mlTours = require('../../src/locales/ml/tours.json');
const plTours = require('../../src/locales/pl/tours.json');

function getPkgName(tours, code) {
  return tours?.pkgNames?.[code] || null;
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  let created = 0, skipped = 0;

  for (const pkg of PACKAGES) {
    const exists = await Package.findOne({ code: pkg.code });
    if (exists) { skipped++; continue; }

    const names = {
      en: getPkgName(enTours, pkg.code) || pkg.name,
      es: getPkgName(esTours, pkg.code) || pkg.name,
      fr: getPkgName(frTours, pkg.code) || pkg.name,
      hi: getPkgName(hiTours, pkg.code) || pkg.name,
      de: getPkgName(deTours, pkg.code) || pkg.name,
      ja: getPkgName(jaTours, pkg.code) || pkg.name,
      pt: getPkgName(ptTours, pkg.code) || pkg.name,
      it: getPkgName(itTours, pkg.code) || pkg.name,
      zh: getPkgName(zhTours, pkg.code) || pkg.name,
      ar: getPkgName(arTours, pkg.code) || pkg.name,
      ko: getPkgName(koTours, pkg.code) || pkg.name,
      ml: getPkgName(mlTours, pkg.code) || pkg.name,
      pl: getPkgName(plTours, pkg.code) || pkg.name,
    };

    await Package.create({ code: pkg.code, names, days: pkg.days, nights: pkg.nights, theme: pkg.theme, places: pkg.places, tags: pkg.tags, img: pkg.img });
    created++;
    process.stdout.write(`✔ [${created}] ${pkg.code}\r`);
  }

  console.log(`\n\nDone! Created: ${created}, Skipped (already exist): ${skipped}`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
