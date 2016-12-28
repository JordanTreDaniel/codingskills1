namespace codingskills {

    angular.module('codingskills', ['ui.router', 'ngResource', 'ngMaterial']).config((
        $stateProvider: ng.ui.IStateProvider,
        $urlRouterProvider: ng.ui.IUrlRouterProvider,
        $locationProvider: ng.ILocationProvider
    ) => {
        // Define routes
        $stateProvider
            .state('nav', {
                templateUrl: '/ngApp/views/nav.html',
                controller: codingskills.Controllers.NavController,
                abstract: true,
                controllerAs: 'vm'
            })
            .state('home', {
                url: '/',
                templateUrl: '/ngApp/views/home.html',
                controller: codingskills.Controllers.HomeController,
                controllerAs: 'controller',
                parent: 'nav'
            })





            .state('gym', {
                url: '/gym', 
                templateUrl: '/ngApp/views/gym.html',
                controller: codingskills.Controllers.GymController,
                controllerAs: 'controller',
                parent: 'nav',
            })
            .state('courtside', {
                url: '/courtside',
                templateUrl: '/ngApp/views/courtside.html',
                controller: codingskills.Controllers.CourtsideController,
                controllerAs: 'controller',
                parent: 'gym'
            })
            .state('lockerroom', {
                url: '/lockerroom',
                templateUrl: '/ngApp/views/lockerroom.html',
                controller: codingskills.Controllers.LockerroomController,
                controllerAs: 'controller',
                parent: 'gym',
                params: {
                    stats: null
                }
            })
            .state('scoreboard', {
                url: '/scoreboard',
                templateUrl: '/ngApp/views/scoreboard.html',
                controller: codingskills.Controllers.ScoreboardController,
                controllerAs: 'controller',
                parent: 'gym'
            })






            .state('account', {
                url: '/account',
                templateUrl: '/ngApp/views/account.html',
                controller: codingskills.Controllers.AccountController,
                parent: 'nav'
            })
            .state('myaccount', {
                url: '/:username',
                templateUrl: '/ngApp/views/myaccount.html',
                controller: codingskills.Controllers.MyAccountController,
                controllerAs: "controller",
                parent: 'account'
            })
            .state('loginregister', {
                url: '/registration',
                templateUrl: '/ngApp/views/loginregister.html',
                controller: codingskills.Controllers.LoginRegisterController,
                controllerAs: "controller",
                parent: 'account'
            })





            .state('about', {
                url: '/about',
                templateUrl: '/ngApp/views/about.html',
                controller: codingskills.Controllers.AboutController,
                controllerAs: 'controller',
                parent: 'nav'
            })
            .state('notFound', {
                url: '/notFound',
                templateUrl: '/ngApp/views/notFound.html',
                parent: 'nav'
            });

        // Handle request for non-existent route
        $urlRouterProvider.otherwise('/notFound');

        // Enable HTML5 navigation
        $locationProvider.html5Mode(true);
    });

    

}
