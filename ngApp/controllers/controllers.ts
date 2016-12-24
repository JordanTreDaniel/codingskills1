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
        public words = [];
        public currentWord;
        public typed;
        public difference;
        public getWords() {
            let pattern = '[a]';
            this.$http.get('https://wordsapiv1.p.mashape.com/words/?mashape-key=L1Q3tAzB6rmshe27MNaoQquiTyTVp1aw7icjsnz3QOFVipm7Bv&letterPattern='
                        + pattern)
                .then((results) => {
                    this.words = results.data['results'].data;
                    this.currentWord = this.words[0];        
                    this.difference = this.currentWord;
                }).catch((err) => {
                    console.log("Error getting the words", err);
                });
        }
        public changeDifference() {
            this.difference = this.currentWord.substring(this.typed.length);
        }
        constructor(private $http: ng.IHttpService) {
            this.getWords();
        }

    }
    export class LockerroomController {

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

}
