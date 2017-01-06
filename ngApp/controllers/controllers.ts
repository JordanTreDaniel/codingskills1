namespace codingskills.Controllers {
    export class NavController {
        public role = "Provide Navigation to application"
        public currentUser;
  public self = this;

  constructor(
    private UserService: codingSkills.Services.UserService,
    private $state: ng.ui.IStateService,
    currentUser: ng.ui.IResolvedState
  ) {
    this.currentUser = currentUser;
  }

  logout() {
    this.UserService.logout().then(() => {
      this.$state.go('main.home', null, {reload: true, notify:true});
    }).catch(() => {
      throw new Error('Unsuccessful logout');
    });
  }
    }
    export class HomeController {
        public message = 'Hello from the home page!';
         public currentUser;
  constructor(
    private $state: ng.ui.IStateService,
    currentUser: ng.ui.IResolvedState,
    private $cookies: ng.cookies.ICookiesService
  ) {

    this.currentUser = currentUser;
  }
    }
    export class GymController {

    }
    export class CourtsideController {
        constructor(
            private $http: ng.IHttpService,
            private $state: ng.ui.IStateService
            ) {
                console.log('The state service is ', $state);
                this.getWords();
        }
        public words = [];
        public currentWord;
        public typed;
        public difference;
        public i = 0;
        public gameRunning = false;
        public statsObject = {
            mistakes: 0,
            wordsTyped: 0,
            keysTyped: 0,
            errorRate: 0
        }
        public runGame() {
            if(this.statsObject.wordsTyped == 0 && this.typed == 1 && !this.gameRunning) {
                this.gameRunning = true;
                console.log('game started? ', this.gameRunning);
                let game = window.setTimeout(() => {
                    console.log("I wanted to use the state obj", this.$state);
                    this.$state.go('lockerroom', this.statsObject);
                        }, 15000);
            }
        }
        public getWords() {
            let pattern = '[s]';
            this.$http.get('https://wordsapiv1.p.mashape.com/words/?mashape-key=L1Q3tAzB6rmshe27MNaoQquiTyTVp1aw7icjsnz3QOFVipm7Bv&letterPattern='
                        + pattern)
                .then((results) => {
                    this.words = results.data['results'].data;
                    this.selectWord();
                    this.difference = this.currentWord;
                }).catch((err) => {
                    console.log("Error getting the words", err);
                });
        }
        public changeDifference() {
            this.difference = this.currentWord.substring(this.typed.length);
        }
        public selectWord() {
            this.i++;
            let unwantedChars = new RegExp("['/ .-0-9]", 'g');
            // let unwantedChars = new RegExp("['/]", 'g');

            if (this.i >= this.words.length) {
                console.log(this.statsObject);
            }
            if (this.words[this.i].match(unwantedChars)) {
                this.selectWord(); //My first use of recursion!!!!
            } else {
                this.currentWord = this.words[this.i];
            }
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
                this.selectWord();
                //empty the typing input
                this.typed = '';
            }
        }
    }
    export class LockerroomController {

    }
    export class ScoreboardController {
        
    }
    export class AccountController {

    }
    export class MyAccountController {
        public avatar:string;
        public currentUser;
  
  constructor(
    currentUser: ng.ui.IResolvedState,
    $state: ng.ui.IStateService
  ) 
  
  {
    this.currentUser = currentUser;
    //u must b auth br0 *redirected w/ angular*
    //should be done from stateProvider
    if(!currentUser['username']) {
      $state.go('main.login', null, { reload: true, notify: true });
    }

    if(currentUser['facebookId']){
      this.avatar = `//graph.facebook.com/v2.8/${currentUser['facebookId']}/picture`;
    } else {
      this.avatar = '//placehold.it/350x350';
    }
  }


        

    }
    export class LoginRegisterController {
          public user;
  public currentUser;
  public isLoggedIn;

  public login(user) {
    this.UserService.login(user).then((res) => {
      this.$state.go('main.profile', null, {reload: true, notify:true});
    }).catch((err) => {
      alert('Bunk login, please try again.');
    });
  }

  public register(user) {
    this.UserService.register(user).then((res) => {
      this.$state.go('main.login');
    }).catch((err) => {
      alert('Registration error: please try again.');
    });
  }

  constructor(
    private UserService:codingSkills.Services.UserService,
    private $state: ng.ui.IStateService
  ) {
  }

        
    }
    export class AboutController {
        public message = 'Hello from the about page!';
    }

}
