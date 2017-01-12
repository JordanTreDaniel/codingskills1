namespace codingskills {

    angular.module('codingskills', ['ui.router', 'ngResource', 'ngMaterial', 'ngStorage']).config((
        $stateProvider: ng.ui.IStateProvider,
        $resourceProvider: ng.ui.IStateProvider,
        $httpProvider: ng.IHttpProvider,
        $urlRouterProvider: ng.ui.IUrlRouterProvider,
        $locationProvider: ng.ILocationProvider
    ) => {
        // Define routes
        $stateProvider
          .state('nav', {
              url: '',
              templateUrl: '/ngApp/views/nav.html',
              controller: codingskills.Controllers.NavController,
              abstract: true,
              controllerAs: 'vm',
              resolve: {
                  currentUser: ['Session', (Session) => {
              return Session.getUser();
            }],
            isAuthenticated: ['Session', (Session) => {
              return Session.isAuthenticated();
            }],
            currentNavItem: ['$state', ($state) => {
              return $state.current.name;
            }]
          }
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
              parent: 'gym'
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
        $locationProvider.html5Mode({
          enabled: true,
          requireBase: false,
          rewriteLinks: false
        });

        $httpProvider.interceptors.push('authInterceptor');
    }).factory('_', ['$window',
      function($window) {
        // place lodash include before angular
        return $window._;
      }
    ])
    .factory('authInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
      return {
        responseError: function (response) {
          $rootScope.$broadcast({
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
          }[response.status], response);
          return $q.reject(response);
        }
      };
    })
    .run(
      [
        '$rootScope',
        'UserService',
        '$sessionStorage',
        'Session',
        '$state',
        '_',
        'AUTH_EVENTS',
        (
          $rootScope,
          UserService,
          $sessionStorage,
          Session,
          $state: ng.ui.IStateService,
          _,
          AUTH_EVENTS
        ) => {
          $rootScope.$on('$stateChangeStart', (event, next) => {
            UserService.getCurrentUser().then((user) => {
              $sessionStorage.user = user;
            }).catch((user) => {
              $sessionStorage.user = user;
            });
            let authorizedRoles = !_.isUndefined(next.data, 'authorizedRoles')
              ? next.data.authorizedRoles : false;
            if (authorizedRoles && !Session.isAuthorized(authorizedRoles)) {
              event.preventDefault();
              if(Session.isAuthenticated()){
                //TODO dialog
                // $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                $state.go('home');
              } else {
                // $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                $state.go('home');
              }
            }
          });
        }
      ]
    );
}
