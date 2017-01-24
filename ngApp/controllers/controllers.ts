namespace codingskills.Controllers {
    export class NavController {
        public role = "Provide Navigation to application"
        public currentUser;
        public self = this;

        constructor(
            private UserService: codingskills.Services.UserService,
            private $state: ng.ui.IStateService,
            private Session: codingskills.Services.Session
        ) {
            this.currentUser = Session.getUser();
        }

        logout() {
            this.UserService.logout().then(() => {
                this.$state.go('account', null, { reload: true, notify: true });
            }).catch(() => {
                throw new Error('Unsuccessful logout');
            });
        }
    }

    export class GymController {
        constructor(
            private gameService: codingskills.Services.GameService,
            private Session: codingskills.Services.Session,
            private LEVELS,
            private $state: ng.ui.IStateService
        ) {
                this.currentUser = Session.getUser();
                console.log("User:", this.currentUser);
                //Initialize game object to be passed to courtside
                this.gameObject = {
                    date: new Date(),
                    mistakes: 0,
                    wordsTyped: 0,
                    keysTyped: 0,
                    accuracy: 0,
                    gameLength: 10000, // 10 sec default gameLength
                    levels: [1], // All levels that are included in the game
                    level: 1, // The highest level of the game
                    owner: this.currentUser._id,
                }
                //I have to check which levels you have completed
                gameService.get({id: this.currentUser._id}).then((results) => {
                    console.log("These are the games you've played", results.results);
                    //Use your game history to set the levels
                    for (let x of results.results) {
                        if (this.gameObject.levels.includes(x['level'])) {
                            continue;
                        } else {
                            this.gameObject.levels.push(x['level']);
                        }
                        console.log("Game", x, "Levels", this.gameObject.levels);
                    }
                    //Levels should be sorted so that I can add most recent level and read it easily
                    this.gameObject.levels.sort();
                    //I will progress you through the levels here
                    let nextLevel = this.gameObject.levels[this.gameObject.levels.length - 1] + 1;
                    console.log("Current levels are", this.gameObject.levels, "next is", nextLevel);
                    //Checking to see if you have completed level one,
                    //and that you haven't completed the last level already
                    if (results.results.length > 0 && LEVELS[nextLevel]) {
                        this.gameObject.levels.push(nextLevel);
                    }
                }).catch((err) => {
                    console.log("Err fetching games", err);
                });
        }
        public currentUser;
        public gameObject;
        public startPractice() {
            this.$state.go('courtside', {gameObject: this.gameObject});
        }
    }
    export class CourtsideController {
        constructor(
            private $http: ng.IHttpService,
            private $state: ng.ui.IStateService,
            private $stateParams: ng.ui.IStateParamsService,
            private wordService: codingskills.Services.WordService,
            private LEVELS,
            private Session: codingskills.Services.Session,
            private gameService: codingskills.Services.GameService
            ) {
                this.currentUser = Session.getUser();
                //How could I check to see if the controller has
                //an actual user right there?

                //Pull the game object from params to configure/track game
                this.gameObject = $stateParams['gameObject'];

                this.setLetters();
                this.genWord();
        }
        //Set something to hold all lettersMax
        public currentLetters = [];
        //Holds target word to be typed
        public currentWord;
        public typed;
        //Difference between the word and what you have typed
        public difference;
        public gameRunning = false;

        //Not sure if we still need current user in this state
        public currentUser;

        //To pass to the next state, 
        //where the average will be calculated,
        //after it is recieved from the gym state
        public gameObject;

        //Initiliaze time-loop and stats counting
        public runGame() {
            if(this.gameObject.wordsTyped == 0 && !this.gameRunning) {
                this.gameRunning = true;
                console.log('game started? ', this.gameRunning);
                let game = window.setTimeout(() => {
                    //Send to lockerroom once the game is done.
                    this.$state.go('lockerroom', {stats: this.gameObject});
                        }, this.gameObject.gameLength);
            }
        }
        //The substring from this.currentWord of what the user has yet to type
        public changeDifference() {
            this.difference = this.currentWord.substring(this.typed.length);
        }
        public setLetters() {
            for (var i in this.gameObject.levels) {
                this.currentLetters = this.currentLetters.concat(this.LEVELS[this.gameObject.levels[i]]);
            }
        }
        //Sets correct letter set, generates a random word, and sets it to current word
        public genWord() {
            let wordLength = Math.floor(Math.random() * 7) + 1;
            let word = '';
            for (var i = 0; i < wordLength; i++) {
                word += this.currentLetters[Math.floor(Math.random() * this.currentLetters.length)];
            }
            this.currentWord = word;
        }
        
        public keyDown(e) {
            let word = this.currentWord,
                typed = this.typed;
            //start the game
            this.runGame();
            //update the user feedback model
            this.changeDifference();
            //Check for mistakes
            if (e.keyCode == 8) {
                console.log("BACKSPACE!");
            } else {
                //count the keysTyped
                this.gameObject.keysTyped++;
                //basically if they made a mistake
                if (word[typed.length - 1] != typed[typed.length - 1]) {
                    this.gameObject.mistakes++;
                    console.log("mistakes: ", this.gameObject.mistakes);
                }
            }
            //Check for correct completion
            if (this.typed === this.currentWord) {
                //count the wordsTyped
                this.gameObject.wordsTyped++;
                //load a new word
                this.genWord();
                //empty the typing input
                this.typed = '';
            }
        }
    }
    export class LockerroomController {
        constructor(
            private $stateParams: ng.ui.IStateParamsService,
            private $state: ng.ui.IStateService,
            private gameService: codingskills.Services.GameService
            ) {
                this.stats = $stateParams['stats'];
                if (isNaN(this.stats['accuracy'])) {
                    $state.go('courtside');
                }
                this.wordsPerMin = (this.stats['wordsTyped'] * (60/this.stats.gameLength) * 1000);
                this.keysPerMin = (this.stats['keysTyped'] * (60/this.stats.gameLength) * 1000);
                this.accuracy = this.stats.accuracy = Math.floor((((this.stats['keysTyped'] - this.stats['mistakes']) * 100 / this.stats['keysTyped'])));
                gameService.save({game: this.stats}).then((results) => {
                    console.log("All saved", results);
                }).catch((err) => {
                    console.log("Err saving the game");
                })
        }
        public wordsPerMin;
        public keysPerMin;
        public accuracy;
        public stats;
        
    }
    export class ScoreboardController {

    }
    export class AccountController {
      public currentUser;
      constructor(
          private Session: codingskills.Services.Session,
          private $state: ng.ui.IStateService,
          private UserService: codingskills.Services.UserService
      ) {
          this.currentUser = Session.getUser();
      }

      public logout() {
        this.UserService.logout().then((res) => {
            this.$state.go('home', null, { reload: true, notify: true });
        }).catch((err) => {
            console.log(err);
        });
      }
    }
    export class MyAccountController {
        public avatar: string;
        public currentUser;

        constructor(
            private Session: codingskills.Services.Session,
            $state: ng.ui.IStateService
        ) {
            this.currentUser = Session.getUser();
            console.log(this);
            console.log(this.currentUser);
            //u must b auth br0 *redirected w/ angular*
            //should be done from stateProvider
            if (!this.currentUser['username']) {
                $state.go('home', null, { reload: true, notify: true });
            }

            if (this.currentUser['facebookId']) {
                this.avatar = `//graph.facebook.com/v2.8/${this.currentUser['facebookId']}/picture`;
            } else {
                this.avatar = '//placehold.it/350x350';
            }
        }
    }

    export class HomeController {
        public user;
        public newUser;
        public isLoggedIn;
        public currentUser;
        public login(user) {
            this.UserService.login(user).then((res) => {
                this.$state.go('account', null, { reload: true, notify: true });
            }).catch((err) => {
                alert('Bunk login, please try again.');
            });
        }

        public register(user) {
            this.UserService.register(user).then((res) => {
                alert('please login');
                this.$state.go('home', null, { reload: true, notify: true });
            }).catch((err) => {
                alert('Registration error: please try again.');
            });
        }

        public logout() {
          this.UserService.logout().then((res) => {
              this.$state.go('home', null, { reload: true, notify: true });
          }).catch((err) => {
              console.log(err);
          });
        }

        constructor(
            private UserService: codingskills.Services.UserService,
            private $state: ng.ui.IStateService,
            private Session: codingskills.Services.Session
        ) {
          this.currentUser = Session.getUser();
        }


    }
    export class AboutController {
        public message = 'Hello from the about page!';
    }
    export class NotFoundController {
        constructor(
            private $http: ng.IHttpService,
            private wordService: codingskills.Services.WordService
        ) {}
        public query;
        public page = 1;
        public currentWords;
        public wordLength = 5;
        public filterWords() {
            let unwantedChars = new RegExp("['/ .-]|[0-9]", 'g');
            // let unwantedChars = new RegExp("['/]", 'g');
            this.currentWords = this.currentWords.filter((word) => {
                console.log(word, word.match(unwantedChars));
                return !word.match(unwantedChars);
            });
        }
        public getWords() {
            let pattern = `[${this.query}]`;
            this.$http.get('https://wordsapiv1.p.mashape.com/words/?mashape-key=L1Q3tAzB6rmshe27MNaoQquiTyTVp1aw7icjsnz3QOFVipm7Bv&letterPattern='
                        + pattern + '&page=' + this.page + '&lettersMax=' + this.wordLength)
                .then((results) => {
                    this.currentWords = results.data['results'].data;
                    this.filterWords();
                }).catch((err) => {
                    console.log("Error getting the words", err);
                });
        }
        public saveWords() {
            this.wordService.save({words: this.currentWords})
                .then((results) => {
                    console.log(results.message);
                }).catch((err) => {
                    console.log("Something went wrong", err);
                })
        }
    }

}
