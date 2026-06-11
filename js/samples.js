/* Trivia Generator Pro — built-in sample question packs.
   Each entry: [question, answer]. Used by the per-round "fill with samples"
   menu and the Load Sample Game button. */
const TGP_SAMPLES = {
  "General Knowledge": [
    ["How many sides does a stop sign have?", "Eight"],
    ["What is the largest planet in our solar system?", "Jupiter"],
    ["In which city would you find the Eiffel Tower?", "Paris"],
    ["How many cards are in a standard deck, not counting jokers?", "52"],
    ["What do bees collect from flowers to make honey?", "Nectar"],
    ["What is the capital city of Canada?", "Ottawa"],
    ["What color do you get when you mix blue and yellow paint?", "Green"],
    ["How many continents are there on Earth?", "Seven"],
    ["What is the largest ocean on Earth?", "The Pacific Ocean"],
    ["How many strings does a standard guitar have?", "Six"],
    ["How many minutes are in a full day?", "1,440"],
    ["Which month of the year is the shortest?", "February"]
  ],
  "Music": [
    ["Which pop star is known as the “Material Girl”?", "Madonna"],
    ["How many keys are on a standard full-size piano?", "88"],
    ["Which band recorded the album “Abbey Road”?", "The Beatles"],
    ["Freddie Mercury was the lead singer of which band?", "Queen"],
    ["Which country legend sang both “Jolene” and “9 to 5”?", "Dolly Parton"],
    ["Which large orchestral instrument has 47 strings and 7 pedals?", "The harp"],
    ["Which “King of Rock and Roll” lived at Graceland?", "Elvis Presley"],
    ["Beyoncé first rose to fame as a member of which group?", "Destiny's Child"],
    ["Which rapper's real name is Marshall Mathers?", "Eminem"],
    ["“Rolling in the Deep” and “Hello” are hits by which British singer?", "Adele"],
    ["Which band recorded the classic rock staple “Hotel California”?", "Eagles"],
    ["What does it mean to sing “a cappella”?", "Singing without instrumental accompaniment"]
  ],
  "Movies & TV": [
    ["Who directed both “Jaws” and “E.T.”?", "Steven Spielberg"],
    ["In “The Wizard of Oz,” what does Dorothy click together three times?", "Her ruby slippers (heels)"],
    ["“May the Force be with you” comes from which film franchise?", "Star Wars"],
    ["What is the name of the coffee shop in the sitcom “Friends”?", "Central Perk"],
    ["Who played Jack Dawson in “Titanic”?", "Leonardo DiCaprio"],
    ["Which animated film features the song “Let It Go”?", "Frozen"],
    ["In “The Simpsons,” what color is Marge's hair?", "Blue"],
    ["Which actor played Iron Man in the Marvel movies?", "Robert Downey Jr."],
    ["What kind of fish is Nemo in “Finding Nemo”?", "A clownfish"],
    ["Which sitcom is set at the Dunder Mifflin Paper Company?", "The Office"],
    ["What is the name of the cowboy doll in “Toy Story”?", "Woody"],
    ["Which 1993 blockbuster brought dinosaurs back to life in a theme park?", "Jurassic Park"]
  ],
  "Sports": [
    ["How many players from one team are on a basketball court at a time?", "Five"],
    ["How many holes are played in a standard round of golf?", "18"],
    ["Wimbledon, the famous tennis tournament, is held in which country?", "England (the UK)"],
    ["How many points is a touchdown worth, before any extra point?", "Six"],
    ["In baseball, how many strikes make an out?", "Three"],
    ["Which sport is played with a puck?", "Ice hockey"],
    ["How often are the Summer Olympic Games held?", "Every four years"],
    ["What is a perfect score in ten-pin bowling?", "300"],
    ["In soccer, which player is allowed to use their hands during open play?", "The goalkeeper"],
    ["How many rings are on the Olympic flag?", "Five"],
    ["Which boxing legend called himself “The Greatest”?", "Muhammad Ali"],
    ["In which sport would you perform a slam dunk?", "Basketball"]
  ],
  "Science & Nature": [
    ["What is the chemical symbol for gold?", "Au"],
    ["Which planet is known as the Red Planet?", "Mars"],
    ["What gas do plants absorb from the air to make food?", "Carbon dioxide"],
    ["What is the largest mammal on Earth?", "The blue whale"],
    ["How many bones are in the adult human body?", "206"],
    ["What force pulls objects toward the center of the Earth?", "Gravity"],
    ["What is H2O more commonly known as?", "Water"],
    ["How many legs does a spider have?", "Eight"],
    ["Which organ pumps blood around the body?", "The heart"],
    ["What is the fastest land animal?", "The cheetah"],
    ["At what temperature does water freeze, in Fahrenheit?", "32°F (0°C)"],
    ["Which organs filter waste from your blood and produce urine?", "The kidneys"]
  ],
  "History": [
    ["Who was the first President of the United States?", "George Washington"],
    ["In what year did the Titanic sink?", "1912"],
    ["The Great Wall is located in which country?", "China"],
    ["Who painted the Mona Lisa?", "Leonardo da Vinci"],
    ["Which ancient civilization built the pyramids of Giza?", "The Egyptians"],
    ["In which decade did World War II end?", "The 1940s (1945)"],
    ["Which queen of ancient Egypt was linked to Julius Caesar and Mark Antony?", "Cleopatra"],
    ["In what year did the Berlin Wall fall?", "1989"],
    ["Who delivered the famous “I Have a Dream” speech?", "Martin Luther King Jr."],
    ["Which ship carried the Pilgrims to America in 1620?", "The Mayflower"],
    ["Who is credited with inventing the telephone?", "Alexander Graham Bell"],
    ["In what year was the U.S. Declaration of Independence adopted?", "1776"]
  ],
  "Geography": [
    ["What is traditionally considered the longest river in the world?", "The Nile"],
    ["What is the smallest country in the world?", "Vatican City"],
    ["Which U.S. state is the largest by area?", "Alaska"],
    ["What is the capital of Australia?", "Canberra"],
    ["What is the largest hot desert in the world?", "The Sahara"],
    ["Mount Everest sits on the border of Nepal and which other country?", "China (Tibet)"],
    ["Which European country is famously shaped like a boot?", "Italy"],
    ["What is the capital of Japan?", "Tokyo"],
    ["Which two countries share the world's longest international border?", "The United States and Canada"],
    ["The Amazon rainforest is mostly located in which country?", "Brazil"],
    ["Which U.S. city is nicknamed “The Big Apple”?", "New York City"],
    ["Which continent contains the South Pole?", "Antarctica"]
  ],
  "Food & Drink": [
    ["What is the main ingredient in guacamole?", "Avocado"],
    ["Pizza and pasta are signature dishes of which country?", "Italy"],
    ["Which spirit is the traditional base of a margarita?", "Tequila"],
    ["Sushi originated in which country?", "Japan"],
    ["Which fruit is dried to make a raisin?", "A grape"],
    ["Which nut is the main ingredient in marzipan?", "Almond"],
    ["After water, what is the most consumed beverage in the world?", "Tea"],
    ["Which vegetable is fermented to make sauerkraut?", "Cabbage"],
    ["Which Italian coffee drink's name means “milk” in Italian?", "Latte (caffè latte)"],
    ["Which fast-food chain is famous for the Big Mac?", "McDonald's"],
    ["Honey is made by which insects?", "Bees"],
    ["What are the two main fillings of a classic PB&J sandwich?", "Peanut butter and jelly"]
  ]
};

/* Numeric tiebreakers — closest answer wins. */
const TGP_TIEBREAKERS = [
  ["How many feet tall is the Statue of Liberty, heel to torch?", "151 feet"],
  ["What is the height of Mount Everest in feet?", "29,032 feet"],
  ["In what year did the first iPhone go on sale?", "2007"],
  ["In what year did Disneyland open in California?", "1955"],
  ["How many seats are in the U.S. House of Representatives?", "435"],
  ["How many minutes long is the movie “Titanic” (1997)?", "195 minutes"]
];
