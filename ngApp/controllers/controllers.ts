namespace codingskills.Controllers {
    export class NavController {
        public role = "Provide Navigation to application"
    }
    export class HomeController {
        public message = 'Hello from the home page!';
    }
    export class GymController {
         
    }
    export class CourtsideController {
        constructor(
            private $http: ng.IHttpService,
            private $state: ng.ui.IStateService,
            private wordService: codingskills.Services.WordService,
            private LEVELS,
            ) {
                this.genWord();
        }
        public currentLevels = [1, 2];
        public currentLetters = [];
        public currentWord;
        public typed;
        public difference;
        public gameRunning = false;
        public statsObject = {
            mistakes: 0,
            wordsTyped: 0,
            keysTyped: 0,
            errorRate: 0,
            gameLength: 15000
        }
        public runGame() {
            if(this.statsObject.wordsTyped == 0 && !this.gameRunning) {
                this.gameRunning = true;
                console.log('game started? ', this.gameRunning);
                let game = window.setTimeout(() => {

                    this.$state.go('lockerroom', {stats: this.statsObject});
                        }, this.statsObject.gameLength);
            }
        }
        public changeDifference() {
            this.difference = this.currentWord.substring(this.typed.length);
        }
        public setLetters() {
            for (var i in this.currentLevels) {
                this.currentLetters = this.currentLetters.concat(this.LEVELS[this.currentLevels[i]]);
            }
        }
        public genWord() {
            let wordLength = Math.floor(Math.random() * 7) + 1;
            let word = '';
            this.setLetters();
            for (var i = 0; i < wordLength; i++) {
                word += this.currentLetters[Math.floor(Math.random() * this.currentLetters.length)];
            }
            this.currentWord = word;
        }
        public toggleLevelInclusion(number) {
            if (this.currentLevels.includes(number)) {
                this.currentLevels.splice(this.currentLevels.indexOf(number), 1);
            } else {
                this.currentLevels.push(number);
            }
            this.setLetters();
            console.log("Included levels are", this.currentLevels);
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
                this.statsObject.keysTyped++;
                //basically if they made a mistake
                if (word[typed.length - 1] != typed[typed.length - 1]) {
                    this.statsObject.mistakes++;
                    console.log("mistakes: ", this.statsObject.mistakes); 
                }
            }
            //Check for correct completion
            if (this.typed === this.currentWord) {
                //count the wordsTyped
                this.statsObject.wordsTyped++;
                //load a new word
                this.genWord();
                //empty the typing input
                this.typed = '';
            }
        }
    }
    export class LockerroomController {
        public wordsPerMin;
        public keysPerMin;
        public accuracy;
        public stats;
        constructor(private $stateParams: ng.ui.IStateParamsService) {
            this.stats = $stateParams['stats'];
            this.wordsPerMin = (this.stats['wordsTyped'] * 4);
            this.keysPerMin = (this.stats['keysTyped'] * 4);
            this.accuracy = Math.floor((((this.stats['keysTyped'] - this.stats['mistakes']) * 100 / this.stats['keysTyped'])));
        }
    }
    export class ScoreboardController {
        
    }
    export class AccountController {

    }
    export class MyAccountController {

    }
    export class LoginRegisterController {
        
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
